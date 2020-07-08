<?php

namespace App\Http\Controllers;
use App\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PostController extends Controller
{
    
    public function __construct() {
        
        $this->middleware('api.auth',['except' => [
            'getImage' , 
            'getPostsByCategory' , 
            'getPostsByUser' , 
            'index', 'show'
        ]]);
        
    }

    public function index(){
        
         $posts = Post::all();
        
                $data = array(
                    "status" => "success",
                    "code" => 200,
                    "message" => "Todos los posts",
                    "posts" => $posts
                );  
         
         return response()->json($data, $data['code']);
    }
    
    public function show ($id){
        
        $post = Post::find($id)->load('category')
                               ->load('user');
        
        if (is_object($post)){
        
                $data = array(
                    "status" => "success",
                    "code" => 200,
                    "message" => "Post encontrado",
                    "post" => $post
                );  
        }else{
                $data = array(
                    "status" => "error",
                    "code" => 404,
                    "message" => "El post no existe"
                );    
        }
         return response()->json($data, $data['code']);
    }
      
    public function store(Request $request){
        
        // Recoger datos del post
        
        $json = $request->input('json',null);
        $params_array = json_decode($json, true);
        
        if(!empty($params_array)){
            // Conseguir el usuario autenticado

            $user = $this->getIdentity($request);
            
            //Limpiar los datos
            $params_array = array_map("trim", $params_array);

            // Validar los datos del post

            $validator = \Validator::make($params_array,[
                'title' => 'required',
                'content' => 'required',
                'category_id'=>'required|integer|min:1',
                'image'=>'required'
            ]);

            if ($validator->fails()){
                $data = array(
                    "status" => "error",
                    "code" => 404,
                    "message" => "No se ha registrado el post",
                    "errors" => $validator->errors()
                );        
            }else{
                
        
                // Crear el post
            
                $post = new Post();
                $post->title = $params_array['title'];
                $post->content = $params_array['content'];
                $post->user_id = $user->sub;
                $post->category_id = $params_array['category_id'];
                $post->image = $params_array['image'];
                
                $post->save();


                $data = array(
                    "status" => "success",
                    "code" => 200,
                    "message" => "Se ha registrado el post",
                    "post" => $post
                );               

            }
        
        }else {
            $data = array(
                "status" => "error",
                "code" => 400,
                "message" => "Los datos no son correctos"
            );
        }

        return response()->json($data,$data['code']);
    }

    public function update(Request $request,$id){
        

            //Obtener los valores por post

            $json = $request->input('json',null);
            $params_array = json_decode($json, true);
            //$id = $request->input('id',null);

            if(!empty($params_array)){
                //validamos si existe la catgeoría
                
//                $category = Category::find($id);
//                
//                if (is_object($category)){

                    //Limpiar los datos
                    $params_array = array_map("trim", $params_array);

                    // Validar los datos de la categoria
                    $validator = \Validator::make($params_array,[
                        'title' => 'required',
                        'content' => 'required',
                        'category_id' => 'required',
                        'image' => 'required'
                        
                    ]);

                    if ($validator->fails()) {

                        $data = array(
                            "status" => "error",
                            "code" => 404,
                            "message" => "Datos Inválidos",
                            "errors" => $validator->errors()
                         ); 

                    }else{

                         //Quitar campos que no quiero actualizar

                         unset($params_array['id']);
                         unset($params_array['user_id']);
                         unset($params_array['user']);
                         unset($params_array['created_at']);

                        // Conseguir el usuario autenticado

                        $user = $this->getIdentity($request);
                        
//                        $where = ([
//                            "id" => $id,
//                            "user_id" => $user->sub
//                        ]);
//                        
                        // Buscamos que el post sea del usuario autenticado
                        $post = Post::where('id',$id)->where('user_id',$user->sub)->first();
                        
                       
                        if (is_object($post) && !empty($post)){
                            
                            //Actualizar en BD
                        
                            //$post->update($params_array);

                            $post_updated = Post::where('id', $id)->update($params_array);
                            
                            
                            $data = array(
                                "status" => "success",
                                "code" => 200,
                                "message" => "Se actualizó la entrada correctamente",
                                "post" => $post,
                                "changes" => $params_array
                            ); 
                        }else{
                            $data = array(
                               "status" => "error",
                               "code" => 400,
                               "message" => "No existe el post"
                           );                           
                            
                        }
                    }
//                }else{
//                    
//                    $data = array(
//                        "status" => "error",
//                        "code" => 400,
//                        "message" => "Esa categoria no existe"
//                    );
//                    
//                }
                
            }else{
                
                $data = array(
                    "status" => "error",
                    "code" => 400,
                    "message" => "Los datos no son correctos"
                );
            }
            
        
         //Devolver resultado
        return response()->json($data, $data['code']);
        
    }  
     
    public function destroy ($id, Request $request){
        // Conseguir el usuario autenticado

        $user = $this->getIdentity($request);

        // Buscamos post
       $post = Post::where('id',$id)->where('user_id',$user->sub)->first();
       
       if (!empty($post)){         
            // Eliminamos post
            $post->delete();

           // Devolvemos resultado

             $data = array(
                 "status" => "success",
                 "code" => 200,
                 "post" => $post,
                 "message" => "Se eliminio el post"
             );
       }else{
             $data = array(
                 "status" => "Error",
                 "code" => 404,
                 "message" => "No existe ese post"
             );
        }
        return response()->json($data, $data['code']);
        
    }
    
    private function getIdentity($request){
        $token = $request->header('Authorization');
        $jwtAuth = new \JwtAuth();
        $user = $jwtAuth->checkToken($token, true);
        return $user;
    }
    
    public function upload(Request $request){
        
            // Recoger datos de la petición
            $image = $request->file('file0');
            
            //Validar la imagen
            $validate = \Validator::make($request->all(),[
                'file0' => 'required|image|mimes:jpg,jpeg,png,gif'
            ]);
            // Guardar imagen
            if ($image && !$validate->fails()){
                $image_name = time().$image->getClientOriginalName();
                \Storage::disk('images')->put($image_name, \File::get($image));                
                $data = array(
                    "status" => "success",
                    "code" => 200,
                    "message" => "Se subio la imagen correctamente",
                    "image" => $image_name
                );
            }else{

                $data = array(
                    "status" => "error",
                    "code" => 400,
                    "message" => "Falla al subir la imagen"
                );
            }
            return response()->json($data, $data['code']);
    }
        
    public function getImage($filename){
        
        $isset = \Storage::disk('images')->exists($filename);
        
        if ($isset){
            $file = \Storage::disk('images')->get($filename);
            return new Response($file,200);
        }else{
                $data = array(
                    "status" => "error",
                    "code" => 404,
                    "message" => "La imagen no existe"
                );
                return response()->json($data, $data['code']);
        }
    }
    
    public function getPostsByCategory ($id){
        
        $posts = Post::where('category_id',$id)->get();
        
    
            
            $data = array(
                "status" => "success",
                "code" => 200,
                "message" => "Se encontraron los posts",
                "posts" => $posts
            );
          
            
        
        //Devolver resultado
        return response()->json($data, $data['code']);
    }
    
    public function getPostsByUser ($id){
        
        $posts = Post::where('user_id',$id)->get();
        
        $data = array(
            "status" => "success",
            "code" => 200,
            "message" => "Se encontraron los posts",
            "posts" => $posts
        );
        
        //Devolver resultado
        return response()->json($data, $data['code']);
    }
}

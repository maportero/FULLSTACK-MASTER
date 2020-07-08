<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Post;
use App\User;
use Illuminate\Http\Response;


class UserController extends Controller
{

    
    public function register(Request $request){
        
        // Recoger datos del usuario
        
        $json = $request->input('json',null);
        $params_array = json_decode($json, true);
        
        if(!empty($params_array)){

            //Limpiar los datos
            $params_array = array_map("trim", $params_array);

            // Validar los datos del usuario

            $validator = \Validator::make($params_array,[
                'name' => 'required|alpha',
                'surname' => 'required|alpha',
                'email' => 'required|email|unique:users', // Valida que no este duplicad en la tabla users
                'password' => 'required|min:6|max:8',
            ]);

            if ($validator->fails()){
                $data = array(
                    "status" => "error",
                    "code" => 404,
                    "message" => "No se ha registrado el usuario",
                    "errors" => $validator->errors()
                );        
            }else{
                
                // Cifrar la clave
                
                $pwd = hash('sha256',$params_array['password']);
              
        
                // Crear el usuario
            
                $user = new User();
                $user->name = $params_array['name'];
                $user->surname = $params_array['surname'];
                $user->email = $params_array['email'];
                $user->password = $pwd;
                $user->role = "ROLE_USER";
                
                $user->save();


                $data = array(
                    "status" => "success",
                    "code" => 200,
                    "message" => "Se ha registrado el usuario",
                    "user" => $user
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
    
    public function login(Request $request){
        
        //Regoger datos post
        
        $json = $request->input('json',null);
        $params_array = json_decode($json, true);
        
        if(!empty($params_array)){

            //Limpiar los datos
            $params_array = array_map("trim", $params_array);

            // Validar los datos del usuario

            $validator = \Validator::make($params_array,[
                'email' => 'required|email', // Valida que no este duplicad en la tabla users
                'password' => 'required|min:6|max:8',
            ]);

            if ($validator->fails()){
                $data = array(
                    "status" => "error",
                    "code" => 404,
                    "message" => "Datos Inválidos",
                    "errors" => $validator->errors()
                );        
            }else{
                
                 $jwtAuth = new \JwtAuth();
                 
                //cifrar la clave

                $pwd = hash('sha256',$params_array['password']);
                
                //Devolver datos o token
                
                $data = $jwtAuth->signup($params_array['email'],$pwd, isset($params_array['getToken'])? $params_array['getToken'] : null );

            }
        }else {
            $data = array(
                "status" => "error",
                "code" => 400,
                "message" => "Los datos no son correctos"
            );
        }
        
        return response()->json($data, 200);
        
    }
    
    
    public function update(Request $request){
        
        $token = $request->header('Authorization');
        $jwtAuth = new \JwtAuth();
        $checkToken = $jwtAuth->checkToken($token);
        
        
        if ($checkToken){ //Actualizar usuario 
            
            //Obtener los valores por post

            $json = $request->input('json',null);
            $params_array = json_decode($json, true);

            if(!empty($params_array)){

                //Limpiar los datos
                $params_array = array_map("trim", $params_array);
                
                //Obtener usuario actual
                
                $user = $jwtAuth->checkToken($token,true);
                
                
                // Validar los datos del usuario

                $validator = \Validator::make($params_array,[
                    'name' => 'required|alpha',
                    'surname' => 'required|alpha',
                    'email' => 'required|email|unique:users,email,'.$user->sub
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
                     unset($params_array['password']);
                     unset($params_array['id']);
                     unset($params_array['role']);
                     unset($params_array['created_at']);
                     unset($params_array['remember_token']);

                     //Actualizar en BD
                     $user_updated = User::where('id', $user->sub)->update($params_array);
                     
                    //Devolver resultado
                     
                    $data = array(
                        "status" => "success",
                        "code" => 200,
                        "message" => "Se actualizó el usuario correctamente",
                        "user" => $user,
                        "changes" => $params_array
                     ); 
                }
            
                
            }else{
                
                $data = array(
                    "status" => "error",
                    "code" => 400,
                    "message" => "Los datos no son correctos"
                );
            }
            
 
        }else {
            $data = array(
                "status" => "error",
                "code" => 400,
                "message" => "El usuario no está autenticado"
            );
        }
        
        
        return response()->json($data, $data['code']);
        
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
                \Storage::disk('users')->put($image_name, \File::get($image));                
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
        $isset = \Storage::disk('users')->exists($filename);
        
        if ($isset){
            $file = \Storage::disk('users')->get($filename);
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
    
    public function detail($id){
        
        $user = User::find($id);
        
        if (is_object($user)){
            
                $data = array(
                    "status" => "success",
                    "code" => 200,
                    "user" => $user
                );              
        }else{
                $data = array(
                    "status" => "error",
                    "code" => 404,
                    "message" => "Usuario no existe"
                );        
        }
        
        return response()->json($data, $data['code']);
    }
}

<?php

namespace App\Http\Controllers;
use App\Post;
use Illuminate\Http\Request;
use App\Category;
use Illuminate\Http\Response;

class CategoryController extends Controller
{
    public function __construct() {
        $this->middleware('api.auth',['except'=>['index','show']]);
    }

    public function index(){
        
         $categories = Category::all();
        
                $data = array(
                    "status" => "success",
                    "code" => 200,
                    "message" => "Todas las categorias",
                    "categories" => $categories
                );  
         
         return response()->json($data, $data['code']);
    }
    
    public function show ($id){
        
        $category = Category::find($id);
        
        if (is_object($category)){
        
                $data = array(
                    "status" => "success",
                    "code" => 200,
                    "message" => "Categoria encontrada",
                    "category" => $category
                );  
        }else{
                $data = array(
                    "status" => "error",
                    "code" => 404,
                    "message" => "La Categoria no existe"
                );    
        }
         return response()->json($data, $data['code']);
    }
    
    public function store(Request $request){
        
        // Recoger datos de la categoria 
        
        $json = $request->input('json',null);
        $params_array = json_decode($json, true);
        
        if(!empty($params_array)){

            //Limpiar los datos
            $params_array = array_map("trim", $params_array);

            // Validar los datos de la categoría

            $validator = \Validator::make($params_array,[
                'name' => 'required|unique:categories' // validar que el nombre no se repite
            ]);

            if ($validator->fails()){
                $data = array(
                    "status" => "error",
                    "code" => 404,
                    "message" => "No se ha registrado la categoria",
                    "errors" => $validator->errors()
                );        
            }else{
                
        
                // Crear la categoria
            
                $category = new Category();
                $category->name = $params_array['name'];
                
                $category->save();
                

                $data = array(
                    "status" => "success",
                    "code" => 200,
                    "message" => "Se ha registrado la categoria",
                    "category" => $category
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
            

            if(!empty($params_array) ){
//                //validamos si existe la catgeoría
//                
//                $category = Category::find($id);
//                
//                if (is_object($category)){

                    //Limpiar los datos
                    $params_array = array_map("trim", $params_array);

                    // Validar los datos de la categoria
                    $validator = \Validator::make($params_array,[
                        'name' => 'required|unique:categories,name,'.$id
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
                         unset($params_array['created_at']);


                         //Actualizar en BD
                         $category_updated = Category::where('id', $id)->updateOrCreate($params_array);

                        //Devolver resultado

                        $data = array(
                            "status" => "success",
                            "code" => 200,
                            "message" => "Se actualizó la categoria correctamente",
                            "category" => $category_updated,
                            
                         ); 
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
            
        
        
        return response()->json($data, $data['code']);
        
    }    
}

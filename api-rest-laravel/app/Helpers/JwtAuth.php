<?php

namespace App\Helpers;
use Illuminate\Support\Facades\DB;
use Firebase\JWT\JWT;
use App\User;

class JwtAuth {
    
    public $key;
    
    public function __construct() {
        $this->key = 'Esta-es-la-clave-token-098988932';
    }

    public function signup($email, $password, $getToken = null){
            
            // Verficar si exite el usuario
            
            $user = User::where([
                'email' => $email,
                'password' => $password
            ])->first();
            
            // comprobar si son correctos[objeto]
            $signup = false;
            
            if (is_object($user)){
                $signup = true;
            }
            
            // Generar el token con los datos de usuario identificado
            if ($signup){
                
                $token = array(
                    'sub' => $user->id,
                    'email' => $user->email,
                    'name' => $user->name,
                    'surname' => $user->surname,
                    'password' => '',
                    'image' => $user->image,
                    'role' => $user->role,
                    'description' => $user->description,
                    'iat' => time(),
                    'exp' => time() + (7 * 24 * 60 * 60)
                    
                );
                
                $jwt = JWT::encode($token, $this->key,'HS256');
                $decoded = JWT::decode($jwt, $this->key, ['HS256']);
                //Devolver los datos decodificados  objeto o token, en función de un parámetro.
       
                if (is_null($getToken)){
                    
                    $data = $jwt;
                    
                }else{
                    
                    $data = $decoded;
                }
                                    
            }else{
                
                $data = array(
                "status" => "error",
                "code" => 400,
                "message" => "Login fallido"
                );
            }
            
        return $data;
    }
    
    public function checkToken($jwt, $getIdentity = false){
        
        $auth = false;
        
        try{
            $jwt = str_replace('"', '', $jwt);
            $decoded = JWT::decode($jwt, $this->key, ['HS256']);
            
        } catch (\UnexpectedValueException $e){
            $auth = false;
        } catch (\DomainException $e){
            $auth = false;
        }

        if (!empty($decoded) && is_object($decoded) && isset($decoded->sub)){
            $auth=true;
        }
        
        if ($getIdentity){
            
            return $decoded;
        }
        
        return $auth;
        
    }
}


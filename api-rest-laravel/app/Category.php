<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $tables = "categories";
    
    public function posts(){
        // Relacion de uno a Muchos
        return $this->hasMany("App\Post");
    }
    
    
}

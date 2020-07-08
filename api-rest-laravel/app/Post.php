<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $table = 'posts';
    
    protected $fillable = [
        'title','content', 'category_id', 'image' ,
    ];
    
    public function category(){
        // Relacion de muchos a uno
        return $this->belongsTo("App\Category","category_id");
    }
    
    public function user(){
        // Relacion de muchos a uno
        return $this->belongsTo("App\User","user_id");
    }
}

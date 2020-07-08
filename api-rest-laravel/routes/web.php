<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
use App\Http\Middleware\ApiAuthMiddleware;

Route::get('/welcome', function () {
    return view('welcome');
});

//Route::get('/test','UserController@index');
//Route::get('/test2','PostController@index');
//Route::get('/test3','CategoryController@index');

// Rutas del controlado de Usuario
Route::put('/api/user/update','UserController@update');
Route::post('/api/login','UserController@login');
Route::post('/api/register','UserController@register');
Route::post('/api/user/upload','UserController@upload')->middleware(ApiAuthMiddleware::class);
Route::get('/api/user/avatar/{filename}','UserController@getImage');
Route::get('/api/user/profile/{id}','UserController@detail');

// Rutas controlador Categoria
Route::resource('/api/category','CategoryController');

// Rutas controlador Post

Route::get('/api/post/image/{filename}','PostController@getImage');
Route::post('/api/post/upload','PostController@upload');
Route::get('/api/post/category/{id}','PostController@getPostsByCategory');
Route::get('/api/post/user/{id}','PostController@getPostsByUser');
Route::resource('/api/post','PostController');


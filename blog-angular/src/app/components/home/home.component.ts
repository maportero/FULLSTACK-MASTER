import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { global } from '../../services/global';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [PostService, UserService]
})
export class HomeComponent implements OnInit {
	public page_title: string;
	public posts;
	public status: string;
	public url: string;
	public identity;
	public token;


  constructor(
  		private _postService: PostService,
  		private _userService: UserService
  	) { 
  		this.page_title = 'Entradas';
  	}

  ngOnInit(): void {

  	this.getPosts();
  	this.url = global.url;
  	this.identity = this._userService.getIdentity();
  	this.token = this._userService.getToken();

  }

  getPosts(){

  	this._postService.getPosts().subscribe(
	       response => {
		          
		         
		         if (response.status == 'success'){
		           this.posts = response.posts;
		           
		         }

		       },
		       error => {
		            this.status = 'error';
		            console.log(<any>error);
		       }

			); 
  }

  deletePost(id){


  	this._postService.delete(this.token, id).subscribe(
	       response => {
		          
		         this.status = response.status;
		         if (response.status == 'success'){
		           
		           this.getPosts();
		           
		         }

		       },
		       error => {
		            this.status = 'error';
		            console.log(<any>error);
		       }

			); 
  }

}

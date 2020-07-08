import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { User } from '../../models/user';
import { global } from '../../services/global';
import { Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers:  [ UserService, PostService ]
})
export class ProfileComponent implements OnInit {

	public page_title: string;
	public posts;
	public user: User;
	public url: string;
	public token;
	public identity;
	public status;
	public errors: [];

  constructor(

  		private _postService: PostService,
  		private _userService: UserService,
  		private _router: Router,
  		private _route: ActivatedRoute

  	) { 

  	this.page_title = "Perfil del usuario";
  	this.token = this._userService.getToken();
  	this.identity =  this._userService.getIdentity();
  	this.url = global.url;
  	this.user = new User(0,'','','','','','','');

  }

  ngOnInit(): void {
    this.getUser();
  	
  }

  getUser(){

  		this._route.params.subscribe(params => {
			let id = +params['id'];
			
			if (id){

		  		this._userService.getProfile(id).subscribe(
			       response => {
				          
				         
				         if (response.status == 'success'){

								this.user = response.user;
								this.getPosts();
				           
				         }else{

				         	this._router.navigate(['/inicio']);
				         }

				       },
				       error => {
				            this.status = 'error';
				            console.log(<any>error);
				            this._router.navigate(['/inicio']);
				       }

				); 

			}


		});


  }

  getPosts(){


		  		this._userService.getPosts(this.user.id).subscribe(
			       response => {
				          
				         
				         if (response.status == 'success'){
				           this.posts = response.posts;
				           				           
				           
				         }else{

				         	this._router.navigate(['/inicio']);
				         }

				       },
				       error => {
				            this.status = 'error';
				            console.log(<any>error);
				            this._router.navigate(['/inicio']);
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

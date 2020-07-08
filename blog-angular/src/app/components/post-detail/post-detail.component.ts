import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { Post } from '../../models/Post';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { global } from '../../services/global'; 


@Component({
  selector: 'post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  providers: [PostService, UserService]
})
export class PostDetailComponent implements OnInit {
	public page_title: string;
	public post;
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

  	this.page_title = "Detalle de la entrada";
  	this.token = this._userService.getToken();
  	this.identity =  this._userService.getIdentity();
  	//this.post = new Post(0,0,0,'','','','');
  	this.url = global.url;
  }

  ngOnInit(): void {
  	this.getPost();
  }

  getPost(){

  		this._route.params.subscribe(params => {
			let id = +params['id'];
			
			if (id){

		  		this._postService.getPost(this.token, id).subscribe(
			       response => {
				          
				         
				         if (response.status == 'success'){
				           this.post = response.post;
				           
				           
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

}

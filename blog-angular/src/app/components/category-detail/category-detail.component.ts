import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { Category } from '../../models/category';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { global } from '../../services/global';


@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css'],
  providers: [CategoryService, UserService, PostService]
})
export class CategoryDetailComponent implements OnInit {
	public page_title: string;
	public category = Category;
	public posts;
	public url: string;
	public status: string;
	public identity;
	public token;

  constructor(

  		private _postCategory: CategoryService,
  		private _router: Router,
  		private _route: ActivatedRoute,
  		private _userService: UserService,
  		private _postService: PostService,

  	) { 

  	this.page_title = " Entradas de la categoria ";
  	this.url = global.url;
  	this.identity = _userService.getIdentity();
  	this.token = _userService.getToken();
  	this.getCategory();
  	


  }

  ngOnInit(): void {
  }

  getCategory(){

  		this._route.params.subscribe(params => {
			let id = +params['id'];
			
			if (id){

		  		this._postCategory.getCategory(id).subscribe(
			       response => {
				          
				         
				         if (response.status == 'success'){
				           this.category = response.category;
				           this.getPosts(id);
				           
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

  getPosts(id){


			
			if (id){

		  		this._postCategory.getPosts(id).subscribe(
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


		

  }

deletePost(id){


  	this._postService.delete(this.token, id).subscribe(
	       response => {
		          
		         this.status = response.status;
		         if (response.status == 'success'){
		           
		           this.getCategory();
		           
		         }

		       },
		       error => {
		            this.status = 'error';
		            console.log(<any>error);
		       }

			); 
  }

}

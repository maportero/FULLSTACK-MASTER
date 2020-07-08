import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/Post';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { CategoryService } from '../../services/category.service';
import { global } from '../../services/global';
import { Router, ActivatedRoute, Params} from '@angular/router';


@Component({
  selector: 'post-edit',
  // No es necesario crear un template y reutilizamos del de post-new
  templateUrl: '../post-new/post-new.component.html',
  styleUrls: ['./post-edit.component.css'],
  providers: [ UserService, PostService, CategoryService]
})
export class PostEditComponent implements OnInit {
	public page_title: string;
	public post: Post;
	public identity;
	public token;
	public status: string;
	public errors:[];
	public url: string;
	public categories;
	public is_edit: boolean;
	public froala_options: Object = {
	    charCounterCount: true,
	    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
	    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
	    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
	    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
	};

	public	afuConfig = {
	    multiple: false,
	    formatsAllowed: ".jpg,.png,.jpeg, .gif",
	    maxSize: "1",
	    uploadAPI:  {
	      url: global.url + "post/upload",
	      method:"POST",
	      headers: {
		     "Authorization" : this._userService.getToken()
	      },
	    },
	    theme: "attachPin",
	    hideProgressBar: false,
	    hideResetBtn: true,
	    hideSelectBtn: false,
	    attachPinText: "Sube la imágen de la entrada"
	};

  	constructor(
  		private _userService: UserService,
  		private _postService: PostService,
  		private _categoryService: CategoryService,
  		private _router: Router,
  		private _route: ActivatedRoute  		

  	) { 

  		this.url = global.url;
  		this.identity = _userService.getIdentity();
  		this.token = _userService.getToken();
  		this.post = new Post(0,0,0,'','','','');
  		this.page_title = "Edición de Entrada";
  		this.is_edit = true;
  		

  	}

  ngOnInit(): void {
  	this.getCategories();
  	this.getPost();

  }

  onSubmit(form){

   this._postService.update(this.token, this.post).subscribe(
       response => {
         
         if (response && response.status){
              this.errors = null;
              this.status = response.status;
			  
			  // Actualizar post en sesion
			  
			  if (response.changes.post) {
			  	this.post.title = response.changes.title
			  }
			  if (response.changes.content) {
			  	this.post.content = response.changes.content
			  }
			  if (response.changes.category_id) {
			  	this.post.category_id = response.changes.category_id
			  }
			  if (response.changes.image) {
			  	this.post.image = response.changes.image
			  }
			  

         }else{

         	this.status = 'error';
         }


       },
       error => {
            this.status = 'error';
            this.errors = error.error.errors;
            console.log(<any>error);
       }

     ); 
   

  }

  postImageUpload(data){


  		let datos = JSON.parse(data.response);

  		this.post.image = datos.image;
  		
  }

  getCategories(){
	       this._categoryService.getCategories().subscribe(
	       response => {
		          
		         
		         if (response.status == 'success'){
		           this.categories = response.categories;
		           
		         }

		       },
		       error => {
		            this.status = 'error';
		            console.log(<any>error);
		       }

			); 
	}

  getPost(){

  		this._route.params.subscribe(params => {
			let id = +params['id'];
			
			if (id){

		  		this._postService.getPost(this.token, id).subscribe(
			       response => {
				          
				         
				         if (response.status == 'success'){

				           this.post.id = response.post.id;
				           this.post.category_id = response.post.category_id;
				           this.post.user_id = response.post.user_id;
				           this.post.title = response.post.title;
				           this.post.image = response.post.image;
				           this.post.content = response.post.content;

				           if( this.post.user_id != this.identity.sub ){
				           		this._router.navigate(['/inicio']);
				           }
				           
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

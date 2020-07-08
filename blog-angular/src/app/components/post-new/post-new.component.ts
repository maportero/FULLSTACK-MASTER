import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/Post';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { PostService } from '../../services/post.service';
import { global } from '../../services/global';
import { Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css'],
  providers: [UserService, PostService, CategoryService ]
})
export class PostNewComponent implements OnInit {
	public page_title: string;
	public url: string;
	public post: Post;
	public categories;
	public identity: any;
	public token: any;
	public status: string;
	public is_edit: boolean;
  	public errors: any[];
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
	  	private _router: Router
  	) {

			this.url = global.url;
			this.identity = _userService.getIdentity();
			this.token = _userService.getToken();
			this.is_edit = false;
			this.post = new Post(1,this.identity.sub,0,'','','',''); 
			
		  

  	 }

  ngOnInit(): void {
  	this.page_title = "Crear entrada";
  	this.getCategories();

  	
  }

  onSubmit(form){

   this._postService.create(this.token,this.post).subscribe(
       response => {
       	 
         this.status = response.status;
         if (response.status == 'success'){
         	this.post = response.post;
              form.reset();
              this.errors = null;
              this.post.image=null;
              //this._router.navigate(['/crear-entrada']);
              
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
}

import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'category-new',
  templateUrl: './category-new.component.html',
  styleUrls: ['./category-new.component.css'],
  providers: [ UserService, CategoryService ]
})
export class CategoryNewComponent implements OnInit {
  public page_title: string;
  public identity;
  public token;
  public category: Category;
  public errors: [];
  public status: string;

  constructor(
  		private _route: ActivatedRoute,
  		private _router: Router,
  		private _userService: UserService,
  		private _categoryService: CategoryService
  	) { 
  		this.page_title = "Nueva categoría";
  		this.identity = _userService.getIdentity();
  		this.token = _userService.getToken();
  		this.category = new Category(1,'');
  }

  ngOnInit(): void {
  }

  onSubmit(form){

   this._categoryService.create(this.token,this.category).subscribe(
       response => {
       	 
         this.status = response.status;
         if (response.status == 'success'){
         	this.category = response.category;
              form.reset();
              this.errors = null;
              
         }

       },
       error => {
            this.status = 'error';
            this.errors = error.error.errors;
            console.log(<any>error);
       }

     ); 
  }
}

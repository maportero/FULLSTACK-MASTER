import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';
import { CategoryService } from './services/category.service';
import { global } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService, CategoryService]
})
export class AppComponent implements OnInit, DoCheck{
  public title = 'Project blog-angular';
  public token;
  public identity;
  public url: string;
  public status;
  public categories;

  constructor(
  		private _userService: UserService,
      private _categoryService: CategoryService

  	){
  		this.loadUser();
      this.url = global.url;
  		//this.getCategories();
  }

  ngDoCheck(){
    this.loadUser();
    //this.getCategories();
  }

  ngOnInit(){

    console.log('WebApp Cargada');
    this.getCategories(); 
    
    

  }

  loadUser(){
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();

  }

  getCategories(){
       this._categoryService.getCategories().subscribe(
       response => {
          
         
         if (response.status == 'success'){
           this.categories = response.categories;
           console.log(this.categories);
         }

       },
       error => {
            this.status = 'error';
            console.log(<any>error);
       }

     ); 

  }
}

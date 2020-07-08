import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
	public page_title: string;
	public user: User;
	public status: string;
	public errors: any[];
	public token;
	public identity;

  constructor(
  		private _userService: UserService,
  		private _router: Router,
  		private _route: ActivatedRoute
  	) { 
  	this.page_title = "Identificate";
  	this.user = new User(1,'','','ROLE_USER','','','','');

  }
    
  ngOnInit(): void {

  	// Se ejectuta siempre la funcion logout y cierra la sesion si el parametro es 1
	this.logout();

  }


 onSubmit(form){

   this._userService.signup(this.user).subscribe(
       response => {
       	 	
       		// token
       		if (response.status != 'error'){

       			this.status = 'success';
         		this.token = response;
         		// USUARIO IDENTIFICADO
				   this._userService.signup(this.user, true).subscribe(
				       response => {

				         		this.identity = response;
				         		// PERSISTIR DATOS DEL USUARIO
				         		localStorage.setItem('token', this.token);
				         		localStorage.setItem('identity', JSON.stringify(this.identity));
				         		this._router.navigate(['inicio']);
				       },
				       error => {
				            this.status = 'error';
				            this.errors = error.error.errors;
				            console.log(<any>error);
				       }

				     ); 


       		}else{

       			this.status = 'error';
       		}



         	this.errors = null; 
         	form.reset();
       },
       error => {
            this.status = 'error';
            this.errors = error.error.errors;
            console.log(<any>error);
       }

     ); 
	}

	logout(){
		this._route.params.subscribe(params => {
			let logout = +params['sure'];

			if (logout == 1){
				localStorage.removeItem('identity');
				localStorage.removeItem('token');

				this.identity = null;
				this.token = null;

				this._router.navigate(['login']);
			}


		});
	}
}

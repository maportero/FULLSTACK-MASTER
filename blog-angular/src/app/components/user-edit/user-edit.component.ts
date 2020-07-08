import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { global } from '../../services/global';


@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {
	public page_title: string;
	public url: string;
	public user: User;
	public identity: any;
	public token: any;
	public status: string;
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
	      url: global.url + "user/upload",
	      method:"POST",
	      headers: {
		     "Authorization" : this._userService.getToken()
	      },
	    },
	    theme: "attachPin",
	    hideProgressBar: false,
	    hideResetBtn: false,
	    hideSelectBtn: false,
	    attachPinText: "Sube tu avatar de usuario"
	};

  	constructor (
  		private _userService: UserService

  	) { 
    

	this.page_title ='Ajustes de usuario';
	this.url = global.url;
	this.identity = _userService.getIdentity();
	this.token = _userService.getToken();

	this.user = new User(
		this.identity.sub,
		this.identity.name,
		this.identity.surname,
		this.identity.role,
		this.identity.image,
		this.identity.email,
		'',
		this.identity.description);
  }

  ngOnInit(): void {
  }

  onSubmit(form){

   this._userService.update(this.token, this.user).subscribe(
       response => {
         
         if (response && response.status){
              this.errors = null;
              this.status = response.status;
			  
			  // Actualizar usuario en sesion

			  if (response.changes.name) {
			  	this.user.name = response.changes.name
			  }
			  if (response.changes.surname) {
			  	this.user.surname = response.changes.surname
			  }
			  if (response.changes.description) {
			  	this.user.description = response.changes.description
			  }
			  if (response.changes.email) {
			  	this.user.email = response.changes.email
			  }
			  if (response.changes.image) {
			  	this.user.image = response.changes.image
			  }

			  this.identity = this.user;

			  localStorage.setItem('identity', JSON.stringify(this.identity));

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

  avatarUpload(data){


  		let datos = JSON.parse(data.response);

  		this.user.image = datos.image;
  		
  }

}

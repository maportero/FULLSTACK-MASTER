import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {
	public page_title: string;
  public user: User;
  public status: string;
  public errors: any[];

  constructor(
      private _userService: UserService

    ) { 
  	this.page_title = 'Registrate';
    this.user = new User(1,'','','ROLE_USER','','','','');
  }

  ngOnInit(): void {
  	console.log('Se cargo el componente registrate');
  }

  onSubmit(form){
   this._userService.register(this.user).subscribe(
       response => {

         this.status = response.status;
         if (response.status == 'success'){
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

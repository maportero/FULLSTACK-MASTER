//IMPORTS NECESSARIOS

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//IMPORTAR COMPONENTES DEL PROYECTO

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CategoryNewComponent} from './components/category-new/category-new.component';
import { CategoryDetailComponent} from './components/category-detail/category-detail.component';
import { PostNewComponent } from './components/post-new/post-new.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PostEditComponent } from './components/post-edit/post-edit.component';
import { IdentityGuard } from './services/identity.guard';
// DEFINICION DE RUTAS
const appRoutes = [
	{ path: '', component: HomeComponent },
	{ path: 'inicio', component: HomeComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'logout/:sure', component: LoginComponent },
	{ path: 'ajustes', component: UserEditComponent, canActivate: [IdentityGuard] },
	{ path: 'perfil/:id', component: ProfileComponent },
	{ path: 'registro', component: RegisterComponent},
	{ path: 'crear-categoria', component: CategoryNewComponent, canActivate: [IdentityGuard]},
	{ path: 'categoria/:id', component: CategoryDetailComponent},
	{ path: 'crear-entrada', component: PostNewComponent, canActivate: [IdentityGuard]},
	{ path: 'editar-entrada/:id', component: PostEditComponent, canActivate: [IdentityGuard]},
	{ path: 'entrada/:id', component: PostDetailComponent},
	{ path: '**' ,component: ErrorComponent }
];

// EXPORTAR CONFIGURACION
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
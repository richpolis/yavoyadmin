import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { registerLocaleData } from '@angular/common';

// importar locales
import localeEs from '@angular/common/locales/es-MX';
import localeEn from '@angular/common/locales/en';

// app
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { PagesComponent } from './pages/pages.component';

// bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppBootstrapModule } from './app-bootstrap.module';

// Componentes compartido
import { SharedModule } from './shared/shared.module';
import { RecoverPasswordModalComponent } from './components/recover-password-modal/recover-password-modal.component';
import { TimepickerModalComponent } from './components/timepicker-modal/timepicker-modal.component';

// Loading router
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoaderScreenComponent } from './components/loader-screen/loader-screen.component';

// services
import { AuthService } from './services/auth.service';
import { GlobalsService } from './services/globals.service';
import { UsersService } from './services/users.service';
import { RolesService } from 'src/app/services/roles.service';
import { CirclesService } from './services/circles.service';
import { EventsService } from './services/events.service';

import { LoaderScreenInterceptorService } from './services/loader-screen-interceptor.service';
import { ServiceRequestScheduleComponent } from './components/service-request-schedule/service-request-schedule.component';
import { ScheduleEventModalComponent } from './components/schedule-event-modal/schedule-event-modal.component';
import { RegisterModalComponent } from './components/register-modal/register-modal.component';

export const interceptorProviders = [
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderScreenInterceptorService, multi: true }
];

// register providers
registerLocaleData(localeEs, 'es');
registerLocaleData(localeEn, 'en');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    PagesComponent,
    LoaderScreenComponent,
    RecoverPasswordModalComponent,
    TimepickerModalComponent,
    ServiceRequestScheduleComponent,
    ScheduleEventModalComponent,
    RegisterModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    AppBootstrapModule,
    SharedModule,
    LoadingBarModule,
    LoadingBarRouterModule
  ],
  exports: [],
  providers: [
    AuthService,
    GlobalsService,
    UsersService,
    RolesService,
    CirclesService,
    EventsService,
    interceptorProviders,
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  entryComponents: [RecoverPasswordModalComponent, RegisterModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

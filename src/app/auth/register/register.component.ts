import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {AlertController, IonicModule, LoadingController} from '@ionic/angular';
import { AuthService } from '../../common/services/auth.service';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  // styleUrls: ['./register.component.scss'],
  standalone: false,
  // imports: [
  //   IonicModule,
  //   ReactiveFormsModule,
  //   NgIf
  // ]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit() {}

  // Custom validator to check if passwords match
  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  async register() {
    if (this.registerForm.invalid) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Creating account...',
    });
    await loading.present();

    const { email, password } = this.registerForm.value;

    try {
      await this.authService.register(email, password);
      this.router.navigate(['/folder/inbox']);
    } catch (error) {
      console.error('Registration error', error);
      this.presentAlert('Registration Failed', 'There was an error creating your account. Please try again.');
    } finally {
      loading.dismiss();
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}

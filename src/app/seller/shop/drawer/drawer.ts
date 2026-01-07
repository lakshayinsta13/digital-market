import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerProfile } from '../../../services/login.services';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule],   // ✅ required for *ngIf
  templateUrl: './drawer.html',
  styleUrls: ['./drawer.css']
})
export class DrawerComponent {

  @Input() seller!: SellerProfile;
  @Output() close = new EventEmitter<void>();

  closeDrawer(): void {
    this.close.emit();
  }
}

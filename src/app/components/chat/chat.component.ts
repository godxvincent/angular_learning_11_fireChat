import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [
  ]
})
export class ChatComponent implements OnInit {

  mensaje: string;
  ventanaMensajes: any;
  constructor( public chatService: ChatService) {
    this.chatService.cargarMensajes().subscribe( () =>
      setTimeout( () => this.ventanaMensajes.scrollTop = this.ventanaMensajes.scrollHeight , 40)
    );
  }

  ngOnInit(): void {
    this.ventanaMensajes = document.getElementById('app-mensajes');
  }

  enviarMensaje(): void {
    console.log(this.mensaje);
    if ( this.mensaje.length === 0 ) {
      return;
    } else {
      this.chatService.agregarMensaje(this.mensaje).then( () => this.mensaje = '' ).catch( (err) => console.error('hubo un error enviando el mensaje', err) );
    }
  }

}

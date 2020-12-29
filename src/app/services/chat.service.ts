import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Message } from '../interfaces/message.interface';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Message>;
  public chats: Message[];
  public usuario: any = {};

  constructor(private afs: AngularFirestore, public auth: AngularFireAuth) {
    this.auth.authState.subscribe( usuario => {
      console.log(usuario);

      if ( !usuario ) {
        return;
      }
      this.usuario.nombre = usuario.displayName;
      this.usuario.uid = usuario.uid;
    });
  }

  cargarMensajes(): Observable<Message[]> {
    this.itemsCollection = this.afs.collection<Message>('chats', (ref) => ref.orderBy('fecha', 'desc').limit(10)  );
    return this.itemsCollection.valueChanges().pipe( map( (mensajes: Message[]) => {
      this.chats = [];

      mensajes.forEach ( mensaje => this.chats.unshift( mensaje ));
      return null;
    })) ;
  }

  agregarMensaje( texto: string ): Promise<any> {
    const mensaje: Message = {
      nombre: this.usuario.nombre,
      uid: this.usuario.uid,
      mensaje: texto,
      fecha: new Date().getTime()
    };

    return this.itemsCollection.add(mensaje);
  }

  login(proveedor: string): void {
    if ( proveedor === 'google') {
      this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } else {
      this.auth.signInWithPopup( new firebase.auth.TwitterAuthProvider());
    }
  }
  logout(): void {
    this.usuario = {};
    this.auth.signOut();
  }
}

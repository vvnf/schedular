import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorageModule  } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class CloudStoreService {

  constructor(
    private firestore: AngularFirestore,
    private afStorage: AngularFireStorageModule
  ) { }


  create_NewUser(userID,record) {
    return this.firestore.collection('user').doc(userID).set(record);
  }

  getUserDetails(userID){
    return this.firestore.collection('user/').doc(userID).snapshotChanges();
  }

  getAllEmp(){
    return this.firestore.collection('user/', ref => ref.where('userType', '==', 'employee')).snapshotChanges();
  }

  createTask(record){
    return this.firestore.collection('tasks').add(record);
  }

  getTaksIcreated(userID){
    return this.firestore.collection('tasks/', ref => ref.where('creatorsUserID', '==', userID)).snapshotChanges();
  }

  getTaks(){
    return this.firestore.collection('tasks/').snapshotChanges();
  }

  getTasksAssignedTome(userID){
    return this.firestore.collection('tasks/', ref => ref.where('assignTo', '==', userID)).snapshotChanges();
  }

}

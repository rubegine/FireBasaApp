// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyD3MY3qXolEaFhY9sGm1OpJXaBNyMfWKXU",
    authDomain: "mouse-center.firebaseapp.com",
    projectId: "mouse-center",
    storageBucket: "mouse-center.appspot.com",
    messagingSenderId: "346623821296",
    appId: "1:346623821296:web:52c061a583f2bfb988c935",
    measurementId: "G-T70KL0XGP9"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
db.collection('mouse');

const list = document.querySelector('ul');
const form = document.querySelector('form');
const unsubscribeBtn = document.querySelector('.unsubscribe');

// add recipes
const addMouse = (mouse, id) => {
   let dataGuardada = mouse.created_at.toDate();
   let diaData = dataGuardada.getDate();
   let mesData = dataGuardada.getMonth() + 1;
   let anyData = dataGuardada.getFullYear();
   diaData = (diaData < 10) ? "0" + diaData : diaData;
   mesData = (mesData < 10) ? "0" + mesData : mesData;
   let dataAMostrar = diaData + "/"
      + mesData + "/"
      + anyData;

   let html = `
   <div>
         <li style="list-style=none" data-id="${id}">
            <b>Marca: ${mouse.marca} Model: ${mouse.model} Color:   ${mouse.color}</b> (${dataAMostrar})
            <button class="btn btn-danger btn-sm my-2">delete</button>
        </li>
   </div>
    `;

   list.innerHTML += html;
};

const deleteMouse = id => {
   const mouse = document.querySelectorAll('li');
   mouse.forEach(mouse => {
      if (mouse.getAttribute('data-id') === id) {
         mouse.remove();
      }
   });
};

// get recipes
// db.collection('recipes').get()
//     .then(snapshot => {
//         snapshot.forEach(doc => {
//             // console.log(doc.data());
//             // console.log("doc.id = " + doc.id);
//             addRecipe(doc.data(), doc.id);
//         });
//     })
//     .catch(err => console.log(err));

// real time listener
const unsubscribe = db.collection('mouse').onSnapshot(snapshot => {
   // console.log(snapshot.docChanges());
   snapshot.docChanges().forEach(change => {
      // console.log(change);
      const doc = change.doc;
      // console.log(doc);
      if (change.type === 'added') {
         addMouse(doc.data(), doc.id);
      } else if (change.type === 'removed') {
         deleteMouse(doc.id);
      }
   });
});


// add documents
form.addEventListener('submit', e => {
   e.preventDefault();
   let now = new Date();

   const mouse = {
      marca: form.marca.value,
      model: form.model.value,
      color: form.color.value,
      created_at: firebase.firestore.Timestamp.fromDate(now)
   };
   // form.mouse.value = "";
   // form.formEntradaAutor.value = "";
   db.collection('mouse').add(mouse)
      .then(() => console.log('Recepta afegida!'))
      .catch(err => console.log(err))
});

// delete documents
// delete documents
list.addEventListener('click', e => {
   // console.log(e);
   if (e.target.tagName === 'BUTTON') {
      const id = e.target.parentElement.getAttribute('data-id');
      // console.log(id);
      db.collection('mouse').doc(id).delete()
         .then(() => console.log('mouse deleted!'))
         .catch((err) => console.log(err));
   }
});

// // unsubscribe from database changes
// unsubscribeBtn.addEventListener('click', () => {
//    unsubscribe();
//    console.log('you unsubscribed from all changes');
// });
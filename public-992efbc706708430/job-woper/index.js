
Promise.resolve().then(() => { console.log('promise'); }); 
console.log('End');

async function getData() { setTimeout(() => { return 'data'; }, 1000); } 

(async () => { const result = await getData(); console.log(result); // undefined 
})();

const nameFormatImage = (txt:string):string=>{

  let result =''

  if (txt){
    const txtList = txt.split('/')
    result = txtList[1]
  }
  


  return result
 } ;

 export { nameFormatImage}
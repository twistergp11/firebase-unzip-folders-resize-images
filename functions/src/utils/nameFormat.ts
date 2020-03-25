const nameFormat = (txt:string):string=>{

  let result =''

  if (txt){
    const txtList = txt.split('/')
    const text = txtList[1]
    const name = text.split('.')
    result = name[0]
  }
  


  return result
 } ;

 export { nameFormat}
addEventListener('load',()=>{
  const focus=new URLSearchParams(location.search).get('focus');
  const target=focus&&document.querySelector(`.tab[data-focus="${focus}"]`);
  if(target instanceof HTMLButtonElement)target.click();
});

function selectAll(){
    let elem = document.getElementsByTagName("input");
    console.log(elem);
    
    if(elem[elem.length - 1].checked === true)
    {
        for(let i = 0; i < elem.length; i++)
        elem[i].checked = true;
    }

    if(elem[elem.length - 1].checked === false)
    {
        for(let i = 0; i < elem.length; i++)
        elem[i].checked = false;
    }
}


let variables = document.getElementsByClassName("variable");
let operations = document.getElementsByClassName("operation");

function clear(elements){
    [...elements].forEach(e => e.classList.remove("td-active"));
}

[...variables].forEach(e => e.addEventListener('click', () => { clear(variables); e.classList.add("td-active")}));
[...operations].forEach(e => e.addEventListener('click', () => { clear(operations); e.classList.add("td-active")}));
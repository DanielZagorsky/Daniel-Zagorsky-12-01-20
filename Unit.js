// function to set a given Unit
function setUnit(Unit) {

    if (localStorage.getItem('Unit') === null) {
        localStorage.setItem('Unit', Unit);
        return false;
    }

    if (localStorage.getItem('Unit') === 'F') {
        return true;
    }

    return false;

}
// function to toggle between F and C
function toggleUnit() {
    
    alert("toggleUnit");
    if (localStorage.getItem('Unit') === 'F') {
        localStorage.removeItem('Unit');
        localStorage.setItem('Unit','C');
        return false;
    } else {
        localStorage.removeItem('Unit');
        localStorage.setItem('Unit','F');
        return true;
    }
}

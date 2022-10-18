// Greetings Home Page


var time;
var d = new Date();
time=d.getHours();
console.log(time)
var greetings="";
if(time<12.0)
{
    greetings="Good Morning!";
}
else if(time<18){
    greetings="Good Afternoon!";
}
else
{
    greetings="Good Evening!";
}
document.getElementById("time").innerHTML=greetings;
console.log(ActivePage);


const activeNav = document.querySelectorAll('nav a').forEach(
    MyLinks => {
        if (MyLinks.href.includes(`${ActivePage}`)) {
            MyLinks.classList.add('Active');
        }
    }
)

function ShowDiv(name){document.getElementById(name).style.visibility = "visible" };
function HideDiv(name){document.getElementById(name).style.visibility ="hidden" };
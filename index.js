// generate container 
const grid = 8
const block_num = 15  // obstacle number


const container = document.querySelector('#container-wrap')
container.style.gridTemplateColumns  = 'repeat(' + grid +', 1fr)'
container.style.gridTemplateRows  = 'repeat(' + grid +', 1fr)'


// create path
function createPath(grid){
  let arr = []
  for (i=1;i<grid;i++){
    for (j=2;j<grid;j++){   
      arr.push([i,j])
    }
  }
 return arr;
}

// let path = [[1,2],[1,3],[2,2],[2,3],[2,5],[3,2],[3,5],[4,4],[4,5],[5,1],[5,2],[5,3],[5,4],[5,5] ]
let path = createPath(grid);
let score = 0;
const score_display = document.querySelector('#score')
const move_display = document.querySelector('#move')
let movePixel = 0;
// timer
const startBtn = document.querySelector('#start')
const stopButton = document.querySelector('#stop')
const resetButton = document.querySelector('#reset')
const timeDisplay = document.getElementById("time-display");

let lastTime;
let countInterval;
let clock = 0;

let isOnce = true;
let Ongoing = true; //hit goal once 

function render() {
  timeDisplay.textContent = (clock/1000).toFixed(2);
}
function updateClock() {
  const currentTime = (new Date()).getTime();
  const delta = currentTime - lastTime;
  clock += delta;
  render();
  lastTime = currentTime;
}
stopButton.setAttribute('disabled', 'true');
resetButton.setAttribute('disabled', 'true');
document.getElementById("time-display").innerHTML = 0;

startBtn.addEventListener("click",  interval = () => {
  lastTime = (new Date()).getTime();
  countInterval = setInterval(updateClock, 100);
  startBtn.setAttribute('disabled', 'true');
  stopButton.removeAttribute('disabled');
  resetButton.removeAttribute('disabled');
  // console.log(countInterval)
});
stopButton.addEventListener("click", stopper = () => {
  clearInterval(countInterval);
  startBtn.removeAttribute('disabled');
  stopButton.setAttribute('disabled', 'true');
  interact('.draggable').unset(); //unset draggable

});
resetButton.addEventListener("click", reset = () => {
  clearInterval(countInterval);
  resetButton.setAttribute('disabled', 'true');
  stopButton.setAttribute('disabled', 'true');
  startBtn.removeAttribute('disabled');
  clock = 0;
  render();
});


//https://stackoverflow.com/questions/11935175/sampling-a-random-subset-from-an-array
function getRandomSubarray(arr, size) {
  let shuffled = arr.slice(0)
  let i = arr.length
  let temp
  let index

  while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
}


//drag and goal
function creatDrag(){
  // size
  let ob = document.querySelector(".obstacles")

  // const drag = document.querySelector('#drag-1')
  // <div id="drag-1" class="draggable">
  let drag = document.createElement('div')
  let p = document.createElement('p')
  p.textContent = "drag";  // drag this element
  //goal
  let goal = document.createElement('div')
  let image = document.createElement('img')
  image.src = "imgs/flag-1.1s-47px.svg"

  drag.setAttribute('id',"drag-1")
  drag.setAttribute('class',"draggable")

  goal.setAttribute('id',"goal")
  goal.setAttribute('style',"justify-content: center;\
                              display: flex; \
                              align-items: center; \
                              grid-area: 1/-2/1/-2;\
                              width: 100%; \
                              ")
  
  drag.appendChild(p)
  goal.appendChild(image)
  container.appendChild(drag)
  container.appendChild(goal);
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function creat_blocks(num){
  if (num>path.length) {num=path.length};
  for (let i=0;i<num;i++){
    let obs = document.createElement('div')

    obs.setAttribute('class',"obstacles");
    container.appendChild(obs)
  }
}

function clearContainer(){
  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild);
    console.log('Clean!!!')
  }
}

function re(){
      reset();
      document.getElementById("time-display").textContent = 0;
      isOnce = true; //
      Ongoing = true // reset hit goal 
      clearContainer()
      creat_blocks(block_num)
      creatDrag()
      let block = document.querySelectorAll(".obstacles")
      var random_block = getRandomSubarray(path, block.length);

      for (let i=0;i<block.length;i++){
        // generate random numbers
        let grid_pos = []

        grid_pos = random_block[i]

        let row_col = `${grid_pos[0]}/${grid_pos[1]}/${grid_pos[0]}/${grid_pos[1]}`;

        block[i].setAttribute('style','grid-area:'+ row_col)
        block[i].style.backgroundColor = getRandomColor();
        }


        // ref: https://interactjs.io/
        // target elements with the "draggable" class
        // create interaction
        interact('.draggable')
        .draggable({
          // enable inertial throwing
          inertia: true,
          // keep the element within the area of it's parent
          modifiers: [
            interact.modifiers.restrictRect({
              endOnly: true
            })
          ],
          // enable autoScroll //restriction: 'parent',
          autoScroll: true,
      
          listeners: {
            // call this function on every dragmove event
            move: dragMoveListener,
      
            // call this function on every dragend event
            end (event) {
              var textEl = event.target.querySelector('p')
              
              //code for limit

              // textEl && (textEl.textContent =
              //   'moved a distance of ' +
              //   (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
              //              Math.pow(event.pageY - event.y0, 2) | 0))
              //     .toFixed(2) + 'px')
            //
            movePixel = (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
            Math.pow(event.pageY - event.y0, 2) | 0)).toFixed(2) + 'px'
            console.log('pixel:',movePixel)

            //
            }
          }
        })

        //
}

//init
ob_position_arr = re()

//restart
// const restartBtn = document.querySelector('#stop')
const restartBtn = document.querySelector('#restart')
restartBtn.addEventListener('click', re)



function dragMoveListener (event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)'

  // update the position attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)

  //my code: if touch the bounding, alert
  targetMove(event)
  touch_ob(event)
  touchGoal(event)

  if (isOnce){
    interval()
    isOnce = false
  };
  if (Ongoing===false){return;}
}

// this function is used later in the resizing and gesture demos
// window.dragMoveListener = dragMoveListener



// function for target touch the border
function targetMove(event){
  let event_box = event.target;
  let box_p1_x = event_box.getBoundingClientRect().x
  let box_p1_y = event_box.getBoundingClientRect().y
  let box_p3_x = box_p1_x + event_box.getBoundingClientRect().width
  let box_p3_y = box_p1_y + event_box.getBoundingClientRect().height

  let con = document.querySelector('#container-wrap')

  let leftUp_x = con.getBoundingClientRect().x
  let leftUp_y = con.getBoundingClientRect().y
  let rightDown_x = con.getBoundingClientRect().x + con.getBoundingClientRect().width
  let rightDown_y = con.getBoundingClientRect().y + con.getBoundingClientRect().height

  if (box_p3_x >= rightDown_x || box_p1_x <= leftUp_x) {
    alert('X out of box!!');
    event_box.setAttribute('data-x', 0) // back to 0
    event_box.setAttribute('data-y', 0) // back to 0
    // stop timer
    stopper()
    
  } else if (box_p3_y >= rightDown_y || box_p1_y <= leftUp_y) {
    alert('Y out of box!!');
    event_box.setAttribute('data-x', 0) // back to 0
    event_box.setAttribute('data-y', 0) // back to 0s
    // stop timer
    stopper()
  } 
  return true
}

// function for touch obstacles



function get_position(block){
  let box_p1_x = block.getBoundingClientRect().x
  let box_p1_y = block.getBoundingClientRect().y
  let box_p3_x = box_p1_x + block.getBoundingClientRect().width
  let box_p3_y = box_p1_y + block.getBoundingClientRect().height
  return [box_p1_x,box_p1_y,box_p3_x,box_p3_y]
}

// goal position



function touchGoal(event){
  [box_p1_x,box_p1_y,box_p3_x,box_p3_y] = get_position(event.target);
  let myGoal = document.querySelector('#goal');
  [goal_p1_x,goal_p1_y,goal_p3_x,goal_p3_y] = get_position(myGoal);
  
  if ( box_p3_x>= goal_p1_x && box_p1_y<=goal_p3_y && Ongoing){
    alert('Goal!!!!!')
    // event_box.setAttribute('data-x', 0) // back to 0
    // event_box.setAttribute('data-y', 0) // back to 0
    Ongoing = false;
    stopper()
    //
    score = document.getElementById("time-display").textContent
    let arr = []
    // create ul
    let ul = document.createElement('ul');
    let li = document.createElement('li')

    ul.appendChild(li);
    li.textContent = score
    score_display.appendChild(ul);
    
    let points = document.querySelectorAll('li')
    points.forEach(element => {
      arr.push(element.textContent)
      console.log(arr.sort()[0])
    });
    document.querySelector('#best-score').innerHTML = 'Best: ' + arr.sort()[0]
  
    // interact('.draggable').unset(); //unset draggable
    return ;

    // ob_position_arr = re()
  
    
  }

}
// creat all positions for obstacles
// var ob_position_arr = []
// let selector_arr = document.querySelectorAll(".obstacles")
// for (let i=0; i<selector_arr.length;i++){
//   ob_position_arr.push(get_position(selector_arr[i]))
// }

function touch_ob(event){
  // get obs
  var ob_position_arr = []
      let selector_arr = document.querySelectorAll(".obstacles")
      for (let i=0; i<selector_arr.length;i++){
        ob_position_arr.push(get_position(selector_arr[i]))
      }

  // targetMove(event);
  let event_box = event.target;
  const box_p1_x = event_box.getBoundingClientRect().x
  const box_p1_y = event_box.getBoundingClientRect().y
  const box_p3_x = box_p1_x + event_box.getBoundingClientRect().width
  const box_p3_y = box_p1_y + event_box.getBoundingClientRect().height

      for (let i=0; i<ob_position_arr.length;i++){
        
        let leftUp_x = ob_position_arr[i][0]
        let leftUp_y = ob_position_arr[i][1]
        let rightDown_x = ob_position_arr[i][2]
        let rightDown_y = ob_position_arr[i][3]
        
        // console.log('touch:',rightDown_x,rightDown_y)
        if ( box_p1_x <= rightDown_x && box_p1_y <= rightDown_y 
                && box_p3_x >= rightDown_x && box_p3_y >= rightDown_y) {

          alert('TOUCH 1 !!');
          event_box.setAttribute('data-x', 0) // back to 0
          event_box.setAttribute('data-y', 0) // back to 0
          // stop timer
          stopper()
          return true;

        } else if (box_p3_x >= leftUp_x && box_p3_y >= leftUp_y 
                  && box_p1_x <= leftUp_x && box_p1_y <= leftUp_y ){
          alert('TOUCH 2 !!');
          event_box.setAttribute('data-x', 0) // back to 0
          event_box.setAttribute('data-y', 0) // back to 0
          // stop timer
          stopper()
          return true;
        }
        else if (box_p3_x >= leftUp_x && box_p1_y <= rightDown_y 
          && box_p1_x <= leftUp_x && box_p3_y >= rightDown_y ){
          alert('TOUCH 3!!');
          event_box.setAttribute('data-x', 0) // back to 0
          event_box.setAttribute('data-y', 0) // back to 0
          // stop timer
          stopper()
          return true;
          }
        else if (box_p1_x <= rightDown_x && box_p3_y >= leftUp_y 
          && box_p3_x >= leftUp_x && box_p1_y <= rightDown_y ){
          alert('TOUCH 4!!');
          event_box.setAttribute('data-x', 0) // back to 0
          event_box.setAttribute('data-y', 0) // back to 0
          // stop timer
          stopper()
          return true;
          }
        
        // Touch Goal
        
      
  }
}




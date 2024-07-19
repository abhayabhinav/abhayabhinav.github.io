const startbutton = document.querySelector('#button1');
const scene1button = document.querySelector('#button2');
const scene2button = document.querySelector('#button3');
const scene3button = document.querySelector('#button4');

var data;

const loadData = async function () {
  data = await d3.csv('https://flunky.github.io/cars2017.csv');
};

loadData();

const width = 500;
const height = 500;
const margin = { top: 40, right: 30, bottom: 40, left: 40 };
const svg = d3.select('svg');

startbutton.addEventListener('click', function () {
  startbutton.textContent = 'Visualization in Progress';
  scene1button.classList.remove('hidden');
  scene2button.classList.remove('hidden');
  scene3button.classList.remove('hidden');
  scene1button.classList.add('active');
  loadScene1();
});

const loadScene1 = function () {
  var x = d3
    .scaleLog()
    .base(10)
    .domain([10, 150])
    .range([margin.left, width - margin.right]);

  var y = d3
    .scaleLog()
    .base(10)
    .domain([10, 150])
    .range([height - margin.bottom, margin.top]);

  svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .selectAll()
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function (d) {
      return x(d.AverageCityMPG);
    })
    .attr('cy', function (d) {
      return y(d.AverageHighwayMPG);
    })
    .attr('r', function (d) {
      return 3 + parseInt(d.EngineCylinders);
    });

  svg
    .append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues([10, 20, 50, 100, 150])
        .tickFormat(d3.format('~s'))
    );

  svg
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(
      d3
        .axisLeft(y)
        .tickValues([10, 20, 50, 100, 150])
        .tickFormat(d3.format('~s'))
    );

  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', height - margin.bottom / 4)
    .style('text-anchor', 'middle')
    .text('Average City MPG');

  svg
    .append('text')
    .attr('x', -height / 2)
    .attr('y', margin.left / 2)
    .attr('transform', 'rotate(-90)')
    .style('text-anchor', 'middle')
    .text('Average Highway MPG');
};

scene1button.addEventListener('click', function () {
  scene1button.classList.add('active');
  scene2button.classList.remove('active');
  scene3button.classList.remove('active');
  loadScene1();
});
// Scene 2 filetr on data
scene2button.addEventListener('click', function () {
  scene1button.classList.remove('active');
  scene2button.classList.add('active');
  scene3button.classList.remove('active');
  loadScene1();
});

scene3button.addEventListener('click', function () {
  scene1button.classList.remove('active');
  scene2button.classList.remove('active');
  scene3button.classList.add('active');
  loadScene1();
});

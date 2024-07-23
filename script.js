const startbutton = document.querySelector('#button1');
const scene1button = document.querySelector('#button2');
const scene2button = document.querySelector('#button3');
const scene3button = document.querySelector('#button4');
const dropdownContainer = document.querySelector('.dropdown-container');
const fuelTypeSelect = document.querySelector('#fuelTypeSelect');
const engineCyliderSelect = document.querySelector('#engineCyliderSelect');
const tooltip = d3.select('.tooltip');

var data = 0;

const loadData = async function () {
  data = await d3.csv('https://flunky.github.io/cars2017.csv');
};

loadData();

const width = 500;
const height = 500;
const margin = { top: 40, right: 30, bottom: 40, left: 40 };
const svg = d3.select('svg');

startbutton.addEventListener('click', function () {
  if (startbutton.textContent === 'Start Visualization') {
    startbutton.textContent = 'Stop Visualization';
    scene1button.classList.remove('hidden');
    scene2button.classList.remove('hidden');
    scene3button.classList.remove('hidden');
    scene1button.classList.add('active');
    loadScene1();
  } else {
    d3.select('svg').html('');
    startbutton.textContent = 'Start Visualization';
    scene1button.classList.add('hidden');
    scene2button.classList.add('hidden');
    scene3button.classList.add('hidden');
    scene1button.classList.remove('active');
    scene2button.classList.remove('active');
    scene3button.classList.remove('active');
    dropdownContainer.classList.add('hidden');
  }
});

const buildScatterPlot = function (data) {
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
    })
    .on('mouseover', function (d) {
      tooltip
        .style('opacity', 1)
        .html(parseInt(d.EngineCylinders))
        .style('left', event.pageX + 5 + 'px')
        .style('top', event.pageY - 28 + 'px');
    })
    .on('mousemove', event => {
      tooltip
        .style('left', event.pageX + 5 + 'px')
        .style('top', event.pageY - 28 + 'px');
    })
    .on('mouseout', () => {
      tooltip.style('opacity', 0);
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

const loadScene1 = function () {
  buildScatterPlot(data);
  addUpwardTrendAnnotation();
};

const loadScene2 = function () {
  const GasolineData = data.filter(d => d.Fuel === 'Gasoline');
  buildScatterPlot(GasolineData);
  addUpwardTrendAnnotation();
};

const loadScene3 = function () {
  const ElectricityData = data.filter(d => d.Fuel === 'Electricity');
  buildScatterPlot(ElectricityData);
};

//scene 1 trigger - explicit trigger - Overview of all Data
scene1button.addEventListener('click', function () {
  scene1button.classList.add('active');
  scene2button.classList.remove('active');
  scene3button.classList.remove('active');
  dropdownContainer.classList.add('hidden');
  loadScene1();
});

// Scene 2 trigger - Fuel type - Gasoline Data
scene2button.addEventListener('click', function () {
  d3.select('svg').html('');
  scene1button.classList.remove('active');
  scene2button.classList.add('active');
  scene3button.classList.remove('active');
  dropdownContainer.classList.add('hidden');
  loadScene2();
});

// Scene 2 trigger - Fuel type - Electricity Data
scene3button.addEventListener('click', function () {
  d3.select('svg').html('');
  scene1button.classList.remove('active');
  scene2button.classList.remove('active');
  scene3button.classList.add('active');
  dropdownContainer.classList.remove('hidden');
  loadScene3();
  fuelTypeSelect.value = 'Select';
  engineCyliderSelect.value = 'All';
  engineCyliderSelect.disabled = true;
});

//Select Fuel Type Drop down triggers
fuelTypeSelect.addEventListener('change', function () {
  d3.select('svg').html('');
  const fuelTypeSelected = fuelTypeSelect.value;
  const fuelTypeData =
    fuelTypeSelected === 'All'
      ? data
      : data.filter(d => d.Fuel === fuelTypeSelected);
  const engineCylindersAvailable = [
    ...new Set(fuelTypeData.map(d => d.EngineCylinders)),
  ].sort((a, b) => a - b);
  engineCyliderSelect.innerHTML = '<option value="All">All</option>';
  engineCylindersAvailable.forEach(cylinder => {
    const option = document.createElement('option');
    option.value = cylinder;
    option.textContent = cylinder;
    engineCyliderSelect.appendChild(option);
  });
  engineCyliderSelect.disabled = false;
  buildScatterPlot(fuelTypeData);
});

//Select Engine Cylinders Drop down triggers
engineCyliderSelect.addEventListener('change', function () {
  d3.select('svg').html('');
  const engineCyliderSelected = engineCyliderSelect.value;
  const engineCylinderData =
    engineCyliderSelected === 'All'
      ? data
      : data.filter(d => d.EngineCylinders === engineCyliderSelected);
  buildScatterPlot(engineCylinderData);
});

const addUpwardTrendAnnotation = function () {
  const annotations = [
    {
      note: {
        label:
          'Engine cylinders are used for the circle size. As the number of engine cylinders in car decreases the fuel efficiency tends to get better. There are few exceptions to this correlation.',
        title: 'Fuel Efficiency and Engine Cylinders Correlation.',
      },
      x: 150,
      y: 300,
      dx: 100,
      dy: -80,
    },
  ];

  const makeAnnotations = d3.annotation().annotations(annotations);

  svg.append('g').attr('class', 'annotation-group').call(makeAnnotations);
};

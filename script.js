async function init() {
  const data = await d3.csv('https://flunky.github.io/cars2017.csv');

  const svgWidth = 300;
  const svgHeight = 300;
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const svg = d3
    .select('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  var x = d3.scaleLog().base(10).domain([10, 150]).range([0, width]);
  var y = d3.scaleLog().base(10).domain([10, 150]).range([height, 0]);

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
    .attr('cy', d => y(d.AverageHighwayMPG))
    .attr('r', d => 2 + parseInt(d.EngineCylinders));

  svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .call(
      d3.axisLeft(y).tickValues([10, 20, 50, 100]).tickFormat(d3.format('~s'))
    );

  svg
    .append('g')
    .attr('transform', 'translate(50,250)')
    .call(
      d3.axisBottom(x).tickValues([10, 20, 50, 100]).tickFormat(d3.format('~s'))
    );
}

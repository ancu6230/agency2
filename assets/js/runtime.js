var currentSize = 'md';
var currentDelay = 5000;
var _scrambleTimer;

/**
  * generate an array of x objects based on <size> params containing {left, top, size}
  */
function generateData(size) {
  var num = 20;
  var currentSize = '' + size;
  switch(size) {
    case 'sm':
      num = 10;
      break;
    case 'md':
      num = 20;
      break;
    case 'lg':
    case 'xl':
      currentSize = 'lg';
      num = 25;
      break;
    case 'xxl':
      num = 50;
      break;
    default: // xs
      num = 5;
      break;
  }
  var data = (new Array(num).fill(0)).map(function(d,i) {
    return {
      size: currentSize,
      top: parseInt(Math.random() * 50) - 25,
      left: (100 / num) * i,
      width: (100 / num),
      k: size + i,
    };
  });
  console.log('generateData() size:', size,'generated:', data.length, 'items, sample:', data[0], data[1]);
  return data;
};
function generateRandomDelay(initial, seed) {
  return function() {
    return (initial + (parseInt(Math.random()*seed) / 10)) + 's';
  }
};

function update(selection, data) {
  var stripesGenerator = selection.selectAll('.stripe').data(data, function(d) {
    return d.k;
  });

  stripesGenerator.exit().remove();

  // UPDATE old elements present in new data.
  stripesGenerator
    .classed('update', true)
    .select('.image-wrapper')
    .style('top', function (d) {
      return d.top + '%';
    })
    .style('transition-delay', generateRandomDelay(0, 10));

  // ENTER new elements present in new data.
  var stripes = stripesGenerator.enter()
    .append('div')
    .classed('stripe', true)
    .attr('data-key', function(d) {
      return d.k;
    });

  stripes
    .style('left', function (d) {
      return d.left + '%';
    })
    .style('width', function (d) {
      return d.width + '%';
    })
    .style('transition-delay', generateRandomDelay(0, 10))
    .append('div')
    .classed('image-wrapper', true)
      .on('mouseenter', function() {
        d3.select(this).style('top', function (d) {
          return '0%';
        }).style('transition-delay', '0s')
      })
      .on('click', function() {
        d3.select(this).style('top', function (d) {
          return '0%';
        }).style('transition-delay', '0s')
      })
      .on('mouseleave', function() {
        d3.select(this).style('top', function (d) {
          return d.top + '%';
        }).style('transition-delay', generateRandomDelay(3, 50))
      })
      .style('top', function (d) {
        return d.top + '%';
      })
      .append('div')
      .classed('image', true)
        .append('img')
        .attr('src', function(d, i) {
          return [
            'assets/images/repair_logo_',
            d.size,
            '_',
            String(i + 1).padStart(2, '0'), '.gif'
          ].join('');
        });
};

function scramble() {
  clearTimeout(_scrambleTimer);
  console.info('Scramble!');
  update(repairThis, generateData(currentSize));
  _scrambleTimer = setTimeout(scramble, currentDelay);
}

function onResize() {
  currentSize = 'xs';
  if (window.innerWidth > 1400) {
    // Extra extra large devices (very large desktops, 1400px and up)
    currentSize = 'xxl';
  } else if (window.innerWidth > 1200) {
    // Extra large devices (large desktops, 1200px and up)
    currentSize = 'xl';
  } else if (window.innerWidth > 992) {
    // Large devices (desktops, 992px and up)
    currentSize = 'lg';
  } else if (window.innerWidth > 768) {
    // Medium devices (tablets, 768px and up)
    currentSize = 'md';
  } else if (window.innerWidth > 576) {
    // Small devices (landscape phones, 576px and up)
    currentSize = 'sm';
  }
  console.info('@window.onResize currentSize:', currentSize);

  clearTimeout(_scrambleTimer);
  _scrambleTimer = setTimeout(scramble, 300);
}


document.addEventListener('DOMContentLoaded', (event) => {
  console.info('@DOMContentLoaded');
  // update variable
  repairThis = d3.select('#repair-this');
  update(repairThis, generateData(currentSize));
  onResize();
  window.onresize = onResize;
});

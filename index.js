const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const operationHistory = [];

app.get('/', (req, res) => {
  res.send('Welcome to the calculator API!');
});

app.get('/history', (req, res) => {
  const historyWithoutHistoryEntry = operationHistory.filter(entry => entry.equation !== '/history');
  res.json({ history: historyWithoutHistoryEntry });
});

app.get('/:url*', (req, res) => {
  const fullUrl = req.params.url + req.params[0];

  if (fullUrl === 'history') {
    res.json({ history: operationHistory });
    return;
  }

  const segments = fullUrl.split('/');
  let result = parseFloat(segments[0]);
  let equation = '';
  
  const numbers = [];
  const operators = [];

  segments.forEach((segment, index) => {
    if (index % 2 === 0) {
      if (index !== 0) {
        equation += ` ${segment}`;
      } else {
        equation += `${segment}`;
      }
      numbers.push(parseFloat(segment));
    } else {
      switch (segment) {
        case 'into':
          operators.push('x');
          equation += ' x';
          break;
        case 'plus':
          operators.push('+');
          equation += ' +';
          break;
        case 'minus':
          operators.push('-');
          equation += ' -';
          break;
        case 'divide':
          operators.push('/');
          equation += ' /';
          break;
        default:
          operators.push(segment);
          equation += ` ${segment}`;
          break;
      }
    }
  });

  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === 'x') {
      numbers[i] *= numbers[i + 1];
      numbers.splice(i + 1, 1);
      operators.splice(i, 1);
      i--;
    } else if (operators[i] === '/') {
      numbers[i] /= numbers[i + 1];
      numbers.splice(i + 1, 1);
      operators.splice(i, 1);
      i--;
    }
  }

  result = numbers[0];
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === '+') {
      result += numbers[i + 1];
    } else if (operators[i] === '-') {
      result -= numbers[i + 1];
    }
  }

  operationHistory.push({ equation: equation, result });

  res.json({ question: equation, Answer: result });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
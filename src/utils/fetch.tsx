import axios from 'axios';

type optionTypes = {
    method: string,
    url: string,
}

export default function fetch(options: optionTypes ) {
  return new Promise((resolve, reject) => {
    axios(options)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        const defaultError = {
          code: 500,
          status: 'error',
          message: 'Failed to fetch data. Please contact developer.'
        };

        if (typeof err.response === 'undefined') reject(defaultError);
        else if (typeof err.response.data === 'undefined') reject(defaultError);
        else reject(err.response.data);
      });
  });
}

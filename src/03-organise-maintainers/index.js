/**
 * Make the following POST request with either axios or node-fetch:

POST url: http://ambush-api.inyourarea.co.uk/ambush/intercept
BODY: {
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
}

 *******

The results should have this structure:
{
    "status": 200.0,
    "location": [
      ...
    ],
    "from": "CACHE",
    "content": [
      ...
    ]
}

 ******

 * With the results from this request, inside "content", 
 * list every maintainer and each package name that they maintain,
 * return an array with the following shape:
[
    ...
    {
        username: "a-username",
        packageNames: ["a-package-name", "another-package"]
    }
    ...
]
 * NOTE: the parent array and each "packageNames" array should 
 * be in alphabetical order.
 */

module.exports = async function organiseMaintainers() {
  // TODO
  let maintainers = [];
  const axios = require('axios');
  const response = await axios.post(
    'http://ambush-api.inyourarea.co.uk/ambush/intercept',
    {
      url: 'https://api.npms.io/v2/search/suggestions?q=react',
      method: 'GET',
      return_payload: true,
    },
  );

  if (response.status === 200 && response.data && response.data.content) {
    const maintainersdata = response.data.content.map(
      m => m.package.maintainers,
    );

    const formattedMaintainers = maintainersdata.flat();
    const allUserNames = formattedMaintainers.map(u => u.username);
    const remDup = new Set(allUserNames);
    const uniqueUserNames = Array.from(remDup);

    const result = uniqueUserNames.map(user => {
      const maintainer = {};
      maintainer.username = user;
      maintainer.packageNames = [];
      response.data.content.map(p => {
        p.package.maintainers.map(m => {
          if (m.username === user) {
            maintainer.packageNames.push(p.package.name);
          }
        });
      });
      return maintainer;
    });

    const sortedUsernames = result.sort((a, b) => {
      {
        if (a.username < b.username) return -1;
        if (a.username > b.username) return 1;
        return 0;
      }
    });

    const sortedPackages = sortedUsernames.map(sp => {
      sp.packageNames.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
      return sp;
    });
    maintainers = sortedPackages;
  }

  return maintainers;
};

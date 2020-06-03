//Service the queue with First-Come, First-Served.
const serviceWithFCFS = (initialPosition, arrOfRequests) => {
  let totalHeadMovement = 0;
  for (let i = 0; i < arrOfRequests.length; i++) {
    if (i === 0) {
      //Get the distance from the initial position to the first request.
      totalHeadMovement = Math.abs(initialPosition - arrOfRequests[i]);
    } else {
      //Get the distance between each request.
      totalHeadMovement += Math.abs(arrOfRequests[i] - arrOfRequests[i - 1]);
    }
  }
  return totalHeadMovement;
};

//Service the queue with Shortest Seek Time First.
const serviceWithSSTF = (initialPosition, arrOfRequests) => {
  let totalHeadMovement = 0;

  //Clone the array and add the initial position.
  const tempArr = [initialPosition, ...arrOfRequests];
  //Have another array with booleans indicating whether the array element has been visited.
  const visitedArr = new Array(tempArr.length).fill(false);

  //Zero indicates that we are at the initial position.
  let currentIdx = 0;

  let finished = false;
  while (!finished) {
    //Traverse the array of requests and compare the current closest position with each position, finding the smallest difference.
    let closestDiff = Infinity;
    let closestIdx = -1;
    for (let i = 0; i < tempArr.length; i++) {
      if (!visitedArr[i] && currentIdx !== i) {
        if (Math.abs(tempArr[i] - tempArr[currentIdx]) < closestDiff) {
          closestIdx = i;
          closestDiff = Math.abs(tempArr[i] - tempArr[currentIdx]);
        }
      }
    }
    //If a closestIdx couldn't be found, then we are done.
    if (closestIdx === -1) {
      finished = true;
    } else {
      //Add the closest difference and mark the cylinder is visited.
      totalHeadMovement += closestDiff;
      visitedArr[closestIdx] = true;
      currentIdx = closestIdx;
    }
  }
  return totalHeadMovement;
};

//Service the queue by first scanning down, then up.
const serviceWithSCAN = (initialPosition, arrOfRequests) => {
  let totalHeadMovement = 0;

  //Create a sorted array.
  let sortedArr = [initialPosition, ...arrOfRequests];
  sortedArr.sort((a, b) => a - b);

  for (let i = 0; i < sortedArr.length - 1; i++) {
    //If we are at the position, return the first sorted array element with the one after the initial position.
    if (sortedArr[i] === initialPosition) {
      totalHeadMovement += Math.abs(sortedArr[0] - sortedArr[i + 1]);
    } else {
      //Calculate the difference between elements.
      totalHeadMovement += Math.abs(sortedArr[i] - sortedArr[i + 1]);
    }
  }
  return totalHeadMovement;
};

//Generates a random series of 1,000 requests with 5,000 cylinders (0-4,999)
const generateArrOfRequests = () => {
  const arr = [];
  for (let i = 0; i < 1000; i++) {
    arr.push(Math.floor(Math.random() * 4999));
  }
  return arr;
};

//Command-line argument. If it isn't provided, or if it is out of range, throw an error.
try {
  const initialPosition = parseInt(process.argv[2]);
  if (!initialPosition) {
    console.error(new Error('No initial position provided'));
    process.exit();
  }
  if (initialPosition < 0 || initialPosition > 4999) {
    console.error(new Error('Initial position is out of range.'));
    process.exit();
  }
  //This array represents the request queue.
  const arrOfRequests = generateArrOfRequests();
  console.log(
    `Total Head Movement with FCFS: ${serviceWithFCFS(
      initialPosition,
      arrOfRequests
    )}`
  );

  console.log(
    `Total Head Movement with SSTF: ${serviceWithSSTF(
      initialPosition,
      arrOfRequests
    )}`
  );

  console.log(
    `Total Head Movement with SCAN: ${serviceWithSCAN(
      initialPosition,
      arrOfRequests
    )}`
  );
} catch (e) {
  console.error(new Error(e));
}

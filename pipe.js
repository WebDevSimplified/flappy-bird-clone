const HOLE_HEIGHT = 200
const PIPE_WIDTH = 120
const PIPE_INTERVAL = 1500
const PIPE_SPEED = 0.75
let pipes = []
let timeSinceLastPipe
let passedPipeCount

export function setupPipes() {
  document.documentElement.style.setProperty("--pipe-width", PIPE_WIDTH)
  document.documentElement.style.setProperty("--hole-height", HOLE_HEIGHT)
  pipes.forEach(pipe => pipe.remove())
  timeSinceLastPipe = PIPE_INTERVAL
  passedPipeCount = 0
}

export function updatePipes(delta) {
  timeSinceLastPipe += delta

  if (timeSinceLastPipe > PIPE_INTERVAL) {
    timeSinceLastPipe -= PIPE_INTERVAL
    createPipe()
  }

  pipes.forEach(pipe => {
    if (pipe.left + PIPE_WIDTH < 0) {
      passedPipeCount++
      return pipe.remove()
    }
    pipe.left = pipe.left - delta * PIPE_SPEED
  })
}

export function getPassedPipesCount() {
  return passedPipeCount
}

export function getPipeRects() {
  return pipes.flatMap(pipe => pipe.rects())
}

function createPipe() {
  const pipeElem = document.createElement("div")
  const topElem = createPipeSegment("top")
  const bottomElem = createPipeSegment("bottom")
  pipeElem.append(topElem)
  pipeElem.append(bottomElem)
  pipeElem.classList.add("pipe")
  pipeElem.style.setProperty(
    "--hole-top",
    randomNumberBetween(
      HOLE_HEIGHT * 1.5,
      window.innerHeight - HOLE_HEIGHT * 0.5
    )
  )
  const pipe = {
    get left() {
      return parseFloat(
        getComputedStyle(pipeElem).getPropertyValue("--pipe-left")
      )
    },
    set left(value) {
      pipeElem.style.setProperty("--pipe-left", value)
    },
    remove() {
      pipes = pipes.filter(p => p !== pipe)
      pipeElem.remove()
    },
    rects() {
      return [
        topElem.getBoundingClientRect(),
        bottomElem.getBoundingClientRect(),
      ]
    },
  }
  pipe.left = window.innerWidth
  document.body.append(pipeElem)
  pipes.push(pipe)
}

function createPipeSegment(position) {
  const segment = document.createElement("div")
  segment.classList.add("segment", position)
  return segment
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

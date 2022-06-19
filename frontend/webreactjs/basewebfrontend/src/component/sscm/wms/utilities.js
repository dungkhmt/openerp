import React from 'react'

export function setCanvasSize(size, maxSize){
  if(size == 0) {
    return 10;
  }
  return (size/maxSize*1000);
}
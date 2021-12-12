import React from 'react'
import styled from 'styled-components'

export const IconImage = styled.img`
  max-width: 256px;
  max-height: 256px;
  background-image: linear-gradient(45deg, #b0b0b0 25%, transparent 25%),
                    linear-gradient(-45deg, #b0b0b0 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #b0b0b0 75%),
                    linear-gradient(-45deg, transparent 75%, #b0b0b0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
`

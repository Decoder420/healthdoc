'use client';

import React, { memo } from 'react';
import Barcode from 'react-barcode';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


interface BarcodeDisplayProps {
  value: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
  lineColor?: string;
  background?: string;
}

function BarcodeDisplay({
  value,
  width = 2,
  height = 80,
  displayValue = true,
  lineColor = '#000000',
  background = '#FFFFFF',
}: BarcodeDisplayProps) {
  if (!value.trim()) {
    return (
      <Typography color="error" variant="body2">
        Barcode value is required.
      </Typography>
    );
  }

  return (
    <Box
        role="img"
      aria-label={`Barcode for ${value}`}
    >
      <Barcode
        value={value}
        format="CODE128"
        width={width}
        height={height}
        displayValue={displayValue}
        lineColor={lineColor}
        background={background}
      />
    </Box>
  );
}

export default memo(BarcodeDisplay);
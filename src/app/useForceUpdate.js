import React, { useState, useEffect } from 'react';
function useForceUpdate() {
    const [value, setValue] = useState(false);
    return () => value ? setValue(false) : setValue(true);
}

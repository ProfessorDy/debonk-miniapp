const withdrawSol = async (webApp: any) => {
    const response = await fetch('/api/withdrawSol', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ webApp }), // Send webApp object as part of the request
    });
  
    const data = await response.json();
    if (response.ok) {
      console.log('Withdrawal successful:', data.message);
    } else {
      console.error('Error during withdrawal:', data.error);
    }
  };
  
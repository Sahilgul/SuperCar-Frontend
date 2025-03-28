'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface AIRequestPayload {
  query: string;
  session_id: string;
}

interface ToolOutput {
  name: string;
  output: any;
}

export function useAIResponse() {
  const [isLoading, setIsLoading] = useState(false);
  const [textResponse, setTextResponse] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toolOutputs, setToolOutputs] = useState<ToolOutput[]>([]);
  const [currentTool, setCurrentTool] = useState<string | null>(null);
  
  // Use a ref to store the current fetch controller so we can abort it if needed
  const abortControllerRef = useRef<AbortController | null>(null);
  // Use a ref to store the EventSource instance
  const eventSourceRef = useRef<EventSource | null>(null);

  // Cleanup function to be called when unmounting or when starting a new request
  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const sendQuery = useCallback(async (payload: AIRequestPayload) => {
    // Reset states
    setIsLoading(true);
    setTextResponse('');
    setIsComplete(false);
    setError(null);
    setToolOutputs([]);
    setCurrentTool(null);
    
    // Clean up any existing connections
    cleanup();
    
    try {
      // Create a new AbortController for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Make the initial POST request
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(payload),
        signal: abortController.signal,
      });
      console.log('Response received', response);  // Add this
      console.log('Readable stream?', !!response.body);  // Add this
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is not readable');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // Variables to hold the event parsing state
      let buffer = '';
      let currentEventType = '';
      let currentData = '';

      // Process the stream
      // while (true) {
      //   const { done, value } = await reader.read();
        
      //   if (done) {
      //     break;
      //   }
        
      //   // Decode the chunk and add it to our buffer
      //   buffer += decoder.decode(value, { stream: true });
        
      //   // Process complete lines from the buffer
      //   let lineEndIndex;
      //   while ((lineEndIndex = buffer.indexOf('\n')) !== -1) {
      //     const line = buffer.substring(0, lineEndIndex);
      //     buffer = buffer.substring(lineEndIndex + 1);
          
      //     if (line.startsWith('event: ')) {
      //       // Store the event type
      //       currentEventType = line.substring(7).trim();
      //     } else if (line.startsWith('data: ')) {
      //       // Store the data content
      //       currentData = line.substring(6);
            
      //       // Process complete SSE message
      //       handleSSEMessage(currentEventType, currentData);
            
      //       // Reset for next message
      //       currentData = '';
      //     } else if (line === '') {
      //       // Empty line can be a separator between messages
      //       // Do nothing
      //     } else {
      //       // Unexpected line format
      //       console.warn('Unexpected SSE line format:', line);
      //     }
      //   }
      // }
      
      // Process the stream
// while (true) {
//   const { done, value } = await reader.read();
//   console.log('Chunk received', { done, value: value ? decoder.decode(value) : null });  // Add this
//   if (done) {
//     break;
//   }
  
//     // Decode the chunk and add it to our buffer
//     buffer += decoder.decode(value, { stream: true });
//     console.log('Current buffer:', buffer);  // Add this
//   // Process complete messages from the buffer
//   while (true) {
//     // // Look for the next double newline (end of message)
//     // const messageEnd = buffer.indexOf('\n\n');
//     // if (messageEnd === -1) break; // No complete message yet
    
//     // // Extract the complete message
//     // const message = buffer.substring(0, messageEnd);
//     // buffer = buffer.substring(messageEnd + 2); // Remove processed message
    
//     // // Parse the message
//     // let eventType = '';
//     // let data = '';
    
//     // const lines = message.split('\n');
//     // for (const line of lines) {
//     //   if (line.startsWith('event:')) {
//     //     eventType = line.substring(6).trim();
//     //   } else if (line.startsWith('data:')) {
//     //     data = line.substring(5).trim();
//     //   }
//     // }


//     const messageEnd = Math.min(
//       buffer.indexOf('\r\n\r\n'),
//       buffer.indexOf('\n\n'),
//       buffer.length
//     );
    
//     if (messageEnd === buffer.length) break; // No complete message

//     const message = buffer.substring(0, messageEnd);
//     buffer = buffer.substring(messageEnd + (buffer.includes('\r\n\r\n') ? 4 : 2));

//     let eventType = '';
//     let data = '';
    
//     // Handle both \r\n and \n line endings
//     message.split(/\r?\n/).forEach(line => {
//       if (line.startsWith('event:')) eventType = line.substring(6).trim();
//       if (line.startsWith('data:')) data = line.substring(5).trim();
//     });
    
//     // Process the complete message
//     if (eventType && data !== '') {
//       console.log('Processing message:', { eventType, data });
//       handleSSEMessage(eventType, data);
//     }
//   }
// }


while (true) {
  const { done, value } = await reader.read();
  
  if (done) {
    console.log('Stream ended');
    break;
  }
  
  // Decode the chunk and add it to our buffer
  buffer += decoder.decode(value, { stream: true });
  console.log('Current buffer:', buffer);

  // Process complete messages (handling both \r\n and \n line endings)
  let messageEnd;
  while ((messageEnd = findMessageEnd(buffer)) !== -1) {
    const message = buffer.substring(0, messageEnd);
    buffer = buffer.substring(messageEnd + (buffer.includes('\r\n\r\n') ? 4 : 2));
    
    let eventType = '';
    let data = '';
    
    // Split lines handling both line ending types
    message.split(/\r?\n/).forEach(line => {
      if (line.startsWith('event:')) eventType = line.substring(6).trim();
      if (line.startsWith('data:')) data = line.substring(5).trim();
    });

    console.log('Processing message:', { eventType, data });
    if (eventType && data !== undefined) {
      handleSSEMessage(eventType, data);
    }
  }
}


// Helper function to find message end
function findMessageEnd(buffer: string): number {
  const crlfIndex = buffer.indexOf('\r\n\r\n');
  const lfIndex = buffer.indexOf('\n\n');
  
  if (crlfIndex !== -1 && lfIndex !== -1) {
    return Math.min(crlfIndex, lfIndex);
  }
  return crlfIndex !== -1 ? crlfIndex : lfIndex;
}


      // Success, we're done
      setIsComplete(true);
      setIsLoading(false);
    } catch (err) {
      // Only set error if we didn't abort intentionally
      if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
        setError(err instanceof Error ? err.message : String(err));
      }
      setIsLoading(false);
    }
  }, [cleanup]);

  // const handleSSEMessage = (eventType: string, data: string) => {
  //   console.log('Handling message:', eventType, data); // Debug log
  //   switch (eventType) {
  //     case 'chunk':
  //       setTextResponse(prev => prev + data);
  //       break;
  //     case 'tool_use':
  //       try {
  //         // Try to parse as JSON first (for complex tool use format)
  //         let toolName = '';
          
  //         // Check if data contains JSON-like content with tool_calls
  //         if (data.includes('tool_calls') || data.includes('function')) {
  //           try {
  //             // Extract JSON from potentially mixed content
  //             const jsonMatch = data.match(/{.*}/s);
  //             if (jsonMatch) {
  //               const jsonData = JSON.parse(jsonMatch[0]);
                
  //               // Handle different possible JSON structures
  //               if (jsonData.tool_calls && jsonData.tool_calls.length > 0) {
  //                 if (jsonData.tool_calls[0].function && jsonData.tool_calls[0].function.name) {
  //                   toolName = jsonData.tool_calls[0].function.name;
  //                 } else if (jsonData.tool_calls[0].name) {
  //                   toolName = jsonData.tool_calls[0].name;
  //                 }
  //               } else if (jsonData.function && jsonData.function.name) {
  //                 toolName = jsonData.function.name;
  //               } else if (jsonData.name) {
  //                 toolName = jsonData.name;
  //               }
  //             }
  //           } catch (e) {
  //             console.warn('Failed to parse tool_use JSON:', e);
  //           }
  //         }
          
  //         // If we couldn't extract from JSON, use the raw data
  //         if (!toolName) {
  //           toolName = data.trim();
  //         }
          
  //         setCurrentTool(toolName);
  //       } catch (e) {
  //         // If parsing fails, use the data as is
  //         setCurrentTool(data.trim());
  //         console.warn('Failed to parse tool_use data:', e);
  //       }
  //       break;
  //     case 'tool_output':
  //       try {
  //         // Try to parse the tool output as JSON
  //         const parsedData = JSON.parse(data);
  //         // Add to tool outputs
  //         if (parsedData && parsedData.name) {
  //           setToolOutputs(prev => [...prev, {
  //             name: parsedData.name,
  //             output: parsedData.output
  //           }]);
  //         } else if (currentTool) {
  //           // If we have a current tool but the output format is unexpected
  //           setToolOutputs(prev => [...prev, {
  //             name: currentTool,
  //             output: parsedData
  //           }]);
  //         }
  //       } catch (e) {
  //         // If parsing fails, still try to use the data
  //         if (currentTool) {
  //           setToolOutputs(prev => [...prev, {
  //             name: currentTool,
  //             output: data
  //           }]);
  //         }
  //         console.warn('Failed to parse tool output:', e);
  //       }
        
  //       // Reset current tool
  //       setCurrentTool(null);
  //       break;
  //     case 'end':
  //       setIsComplete(true);
  //       setIsLoading(false);
  //       break;
  //     default:
  //       console.warn('Unknown event type:', eventType, 'with data:', data);
  //   }
  // };


  const handleSSEMessage = (eventType: string, data: string) => {
    console.log('Handling message:', eventType, data);
  
    switch (eventType) {
      case 'chunk':
        setTextResponse(prev => prev + data);
        break;
  
      case 'tool_use':
        try {
          let toolName = '';
          
          // Handle both string and JSON tool_use formats
          if (data.includes('{') && data.includes('}')) {
            try {
              const jsonData = JSON.parse(data);
              toolName = jsonData.name || 
                        jsonData.function?.name || 
                        jsonData.tool_calls?.[0]?.name || 
                        jsonData.tool_calls?.[0]?.function?.name || 
                        data.trim();
            } catch (e) {
              console.warn('Failed to parse tool_use JSON:', e);
              toolName = data.trim();
            }
          } else {
            toolName = data.trim();
          }
  
          setCurrentTool(toolName);
          setTextResponse(prev => prev + `\n[Using tool: ${toolName}]\n`);
        } catch (e) {
          console.warn('Failed to process tool_use:', e);
          setCurrentTool(data.trim());
        }
        break;
  
      // case 'tool_output':
      //   try {
      //     let parsedOutput: any;
      //     let toolName = currentTool || 'unknown_tool';
  
      //     // Safely parse the output data
      //     if (typeof data === 'string') {
      //       try {
      //         parsedOutput = JSON.parse(data);
      //       } catch {
      //         // If not JSON, use as-is
      //         parsedOutput = { output: data };
      //       }
      //     } else {
      //       parsedOutput = data;
      //     }
  
      //     // Ensure we have a proper output structure
      //     const normalizedOutput = {
      //       name: parsedOutput.name || toolName,
      //       output: typeof parsedOutput.output === 'object' 
      //         ? parsedOutput.output 
      //         : { result: parsedOutput.output || parsedOutput }
      //     };
  
      //     setToolOutputs(prev => [...prev, normalizedOutput]);
          
      //     // Format output for display
      //     const displayOutput = typeof normalizedOutput.output === 'string'
      //       ? normalizedOutput.output
      //       : JSON.stringify(normalizedOutput.output, null, 2);
  
      //     setTextResponse(prev => prev + `\n[Tool result: ${displayOutput}]\n`);
      //   } catch (e) {
      //     console.warn('Failed to process tool_output:', e);
      //     setTextResponse(prev => prev + `\n[Tool error: ${data}]\n`);
      //   }
        
      //   setCurrentTool(null);
      //   break;


      case 'tool_output':
  try {
    // Parse the output data
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    
    // Normalize the output structure
    const normalizedOutput = {
      name: parsedData.name || currentTool || 'unknown_tool',
      output: typeof parsedData.output === 'string' 
        ? parsedData.output 
        : JSON.stringify(parsedData.output)
    };

    setToolOutputs(prev => [...prev, normalizedOutput]);
    setTextResponse(prev => prev + `\n[Tool result]: ${normalizedOutput.output}\n`);
  } catch (e) {
    console.warn('Failed to process tool output:', e);
    setToolOutputs(prev => [...prev, {
      name: currentTool || 'unknown_tool',
      output: data
    }]);
    setTextResponse(prev => prev + `\n[Tool raw output]: ${data}\n`);
  }
  setCurrentTool(null);
  break;
  
      case 'end':
        setIsComplete(true);
        setIsLoading(false);
        break;
  
      default:
        console.warn('Unknown event type:', eventType, 'with data:', data);
    }
  };


  const clearResponse = useCallback(() => {
    setTextResponse('');
    setToolOutputs([]);
    setIsComplete(false);
    setError(null);
  }, []);

  return {
    sendQuery,
    isLoading,
    textResponse,
    isComplete,
    error,
    toolOutputs,
    clearResponse,
  };
}
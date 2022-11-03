

export const redirectionHeaders = [301,302,308]

export function shouldRedirect(statusCode:number){
   return redirectionHeaders.includes(statusCode)
}   
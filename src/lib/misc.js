import {fetch} from "cross-fetch";

export const is_empty = obj => {
  for (let i in obj) return false;
  return true;
}

export const fetch_get = async (endpoint, ) => {
  const answer = await fetch(endpoint);
  const status = await answer.json();
  if (!status.status) alert(`Error from server:\n${status.data}`);
  return status
}

export const fetch_post = async (endpoint, data) => {
  const answer = await fetch(endpoint, {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });
  const status = await answer.json();
  if (!status.status) alert(`Error from server:\n${status.data}`);
  return status

}
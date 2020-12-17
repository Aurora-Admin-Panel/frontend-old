import React, { useEffect } from 'react'
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';

import { artifactsGet } from '../redux/actions/ports'
import PageTitle from '../components/Typography/PageTitle';

function Artifacts() {
  const server_id = parseInt(useParams().server_id);
  const port_id = parseInt(useParams().port_id);
  const artifacts = useSelector(state => state.artifacts[`${server_id}-${port_id}`])
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(artifactsGet(server_id, port_id))

  }, [dispatch, server_id, port_id])
  return artifacts ? (
    <>
    <PageTitle>
      STDOUT
    </PageTitle>
    <div className="flex flex-col justify-start">
      {artifacts.stdout ? artifacts.stdout.split('\n').map(p => (
      <p className="text-gray-700 dark:text-gray-300">
        {p}
      </p>

      )): null}
    </div>
    </>
  ): null;
}

export default Artifacts

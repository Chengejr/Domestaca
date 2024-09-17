import { XIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import userDefault from "../../../Assets/user-default.png";

const UsersList = () => {
  const [usersData, setUsersData] = useState([]);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    const url = `https://homeservice-ixli.onrender.com/allusers`;
    // const url = `http://localhost:5000/allusers`;
    axios.get(url).then((data) => {
      console.log(data.data.users);
      setUsersData(data.data.users);
    });
  }, []);

  const removeUser = (uid) => {
    console.log(uid);
    const url = `https://homeservice-ixli.onrender.com/removeUser/${uid}`;
    // const url = `http://localhost:5000/removeUser/${uid}`;
    axios.delete(url).then((data) => {
      setDeleted(true);
      console.log(deleted);
      // Optionally, fetch updated user data or remove the user from the local state here
      setUsersData(usersData.filter(user => user.uid !== uid));
    });

    //---> using authentication for deleting users ↓
    // axios.delete(url, {
    //   headers: {
    //     Authorization: authorizationToken
    //   },
    //   data: {
    //     source: source
    //   }
    // });
  };

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usersData.map((user) => (
                  <tr key={user.uid}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.photoURL || userDefault}
                            alt="userImage"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.displayName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.metadata.lastSignInTime?.slice(0, 16)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => removeUser(user.uid)}>
                        <XIcon className="h-6 w-6" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;

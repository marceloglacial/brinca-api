import db from "@/config/firestore"
import { Query, addDoc, collection, getDocs } from "firebase/firestore"

export const formatDocs = async (query: Query) => {
    const querySnapshot = await getDocs(query);
    const results: IDocumentData[] = querySnapshot.docs.map(doc => ({
        ...(doc.data() as IDocumentData),
        id: doc.id
    }));
    return results

}

export const addData = async (collectionName: string, pageData: any): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, collectionName), pageData);
        return docRef.id;
    } catch (error) {
        console.log(error);
        throw (error);
    }
};

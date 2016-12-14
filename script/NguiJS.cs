using UnityEngine;
using UnityEditor;
using System.Collections.Generic;
using System.IO;

public class NguiJS
{
    const string JsPrefix = "data=";
    static List<UIAtlas> mUsedAtlas = new List<UIAtlas>();

    [MenuItem("NGUI.js/Export")]
    public static void Export()
    {
        if (Selection.gameObjects == null || Selection.gameObjects.Length == 0)
            throw new System.Exception("You must select at least one game object.");

        mUsedAtlas.Clear();
        var gos = new List<GameObject>(Selection.gameObjects);
        gos.ForEach(go => File.WriteAllText(EditorUtility.SaveFilePanel("Save As", "", go.name, "js"), JsPrefix + Export(go).ToJson()));
        mUsedAtlas.ForEach(atlas => File.WriteAllText(EditorUtility.SaveFilePanel("Save As", "", atlas.name, "js"), JsPrefix + Export(atlas).ToJson()));
    }

    public static LitJson.JsonData Export(GameObject go)
    {
        var data = new LitJson.JsonData();
        data["name"] = go.name;
        data["transform"] = Export(go.transform);
        data["components"] = Export(go.GetComponents<Component>());

        if (go.transform.childCount > 0)
            data["children"] = ExportChildren(go);
        return data;
    }

    public static LitJson.JsonData ExportChildren(GameObject go)
    {
        var data = new LitJson.JsonData();
        var trans = go.transform;
        for (var i = 0; i < trans.childCount; i++)
            data.Add(Export(trans.GetChild(i).gameObject));
        return data;
    }

    public static LitJson.JsonData Export(Transform trans)
    {
        var data = new LitJson.JsonData();
        data["t"] = Export(trans.localPosition);
        data["r"] = Export(trans.localRotation);
        data["s"] = Export(trans.localScale, Vector3.one);
        return data;
    }

    public static LitJson.JsonData Export(Component[] comps)
    {
        var data = new LitJson.JsonData();
        data.SetJsonType(LitJson.JsonType.Array);
        foreach (var comp in comps)
        {
            var obj = Export(comp);
            if (obj != null)
            {
                obj["meta_type"] = comp.GetType().Name;
                data.Add(obj);
            }
        }
        return data;
    }

    public static LitJson.JsonData Export(Component comp)
    {
        if (comp is UISprite) return Export((UISprite)comp);
        return null;
    }

    public static LitJson.JsonData Export(UISprite sprite)
    {
        if (!mUsedAtlas.Contains(sprite.atlas))
            mUsedAtlas.Add(sprite.atlas);

        var data = new LitJson.JsonData();
        data["atlas"] = sprite.atlas.name;
        data["sprite"] = sprite.spriteName;
        data["type"] = (int)sprite.type;
        data["flip"] = (int)sprite.flip;
        //data["flip"] = sprite.fillCenter;
        //data["color"] = sprite.color;
        return data;
    }

    public static LitJson.JsonData Export(UIAtlas atlas)
    {
        var sprites = new LitJson.JsonData();
        foreach (var sprite in atlas.spriteList)
            sprites.Add(Export(sprite));

        var data = new LitJson.JsonData();
        data["sprites"] = sprites;
        return data;
    }

    public static LitJson.JsonData Export(UISpriteData sprite)
    {
        var data = new LitJson.JsonData();
        data["name"] = sprite.name;
        Export(data, "x", sprite.x, 0);
        Export(data, "y", sprite.y, 0);
        Export(data, "w", sprite.width, 0);
        Export(data, "h", sprite.height, 0);
        Export(data, "bl", sprite.borderLeft, 0);
        Export(data, "br", sprite.borderRight, 0);
        Export(data, "bt", sprite.borderTop, 0);
        Export(data, "bb", sprite.borderBottom, 0);
        Export(data, "pl", sprite.paddingLeft, 0);
        Export(data, "pr", sprite.paddingRight, 0);
        Export(data, "pt", sprite.paddingTop, 0);
        Export(data, "pb", sprite.paddingBottom, 0);
        return data;
    }

    public static LitJson.JsonData Export(Vector2 v)
    {
        var data = new LitJson.JsonData();
        data.SetJsonType(LitJson.JsonType.Object);
        Export(data, "x", v.x, 0);
        Export(data, "y", v.y, 0);
        return data;
    }

    public static LitJson.JsonData Export(Vector3 v)
    {
        return Export(v, Vector3.zero);
    }

    public static LitJson.JsonData Export(Vector3 v, Vector3 def)
    {
        var data = new LitJson.JsonData();
        data.SetJsonType(LitJson.JsonType.Object);
        Export(data, "x", v.x, def.x);
        Export(data, "y", v.y, def.y);
        Export(data, "z", v.z, def.z);
        return data;
    }

    public static LitJson.JsonData Export(Vector4 v)
    {
        var data = new LitJson.JsonData();
        data.SetJsonType(LitJson.JsonType.Object);
        Export(data, "x", v.x, 0);
        Export(data, "y", v.y, 0);
        Export(data, "z", v.z, 0);
        Export(data, "w", v.w, 0);
        return data;
    }

    public static LitJson.JsonData Export(Quaternion q)
    {
        var data = new LitJson.JsonData();
        data.SetJsonType(LitJson.JsonType.Object);
        var v = q.eulerAngles;
        Export(data, "x", v.x, 0);
        Export(data, "y", v.y, 0);
        Export(data, "z", v.z, 0);
        return data;
    }
    
    public static void Export(LitJson.JsonData data, string name, int value, int def)
    {
        if (value != def) data[name] = value;
    }
    
    public static void Export(LitJson.JsonData data, string name, float value, float def)
    {
        if (value != def) data[name] = value;
    }
}
